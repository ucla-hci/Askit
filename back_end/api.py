from flask import Flask
from flask_cors import CORS
from scrapinghub import ScrapinghubClient
import re
from bs4 import BeautifulSoup
import csv
import pandas as pd
from rake_nltk import Rake
from flask import send_file, send_from_directory
import os
import boto3
import time
import requests
import webcolors
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize

# nltk.download('stopwords')
# nltk.download('punkt')
# nltk.download('averaged_perceptron_tagger')
# nltk.download('universal_tagset')
# nltk.download('wordnet')

keywords = ["color","size","shape"]

def getReviewlist(asin):
  data = pd.read_csv("log.csv")
  data = data.loc[data['ASIN'] == asin]
  data = data[['Title', 'Content', "Rating"]]
  data["Title"] = data["Title"].fillna("null")
  return data["Content"].tolist()

def filter_gen(rule):
  regex = r"(({}){{1}})"
  regex_k = r"(color|shape|logo|aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgrey|darkgreen|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|grey|green|greenyellow|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgrey|lightgreen|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen)"
  regex_kn = r"(color|shape|logo|aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgrey|darkgreen|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|grey|green|greenyellow|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgrey|lightgreen|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen)?"
  ans = []
  for token in rule:
    if token["name"] == "any":
      ans.append(r"(.*)")
    if token["name"] == "text":
      a = "|".join(token["content"])
      ans.append(regex.format(a))
    if token["name"] == "keywords":
      if token["required"]:
        ans.append(regex_k)
      else:
        ans.append(regex_kn)
  return "".join(ans)

def filter(rule, sentence):
  p = re.compile(filter_gen(rule))
  m = p.search(sentence)
  if m:
    return sentence

def filter_from_contentlist(rule, contentlist):
  ans = []
  for review in contentlist:
    for subsentence in tokenize.sent_tokenize(review):
      m = filter(rule,subsentence)
      if m:
        ans.append(m)
  return ans

tags_dig = {
    "VERB": 0,
    "NOUN": 1,
    "PRON": 2,
    "ADJ": 3,
    "ADV": 4,
    "ADP": 5,
    "CONJ": 6,
    "DET": 7,
    "NUM": 8,
    "PRT": 9,
    "X": "x",
    ".": "p"
}

tag_to_number =  lambda x: str(tags_dig[x[1]])

def sentenceToString(review):
  text = word_tokenize(review)
  tagged = nltk.pos_tag(text, tagset="universal")
  return (text, "".join([tag_to_number(tag) for tag in tagged]))

import re
from nltk.stem import WordNetLemmatizer
from nltk import tokenize
lemmatizer = WordNetLemmatizer()

rule = [
  {
    "index": "a",
    "name" : "pos",
    "content": "ADJ",
    "required" : True,
  },
  {
    "index": "b",
    "name":"keywords",
    "required" : True
  }
]

tags_regex = {
    "VERB": r"(?P<verb>0)",
    "NOUN": r"(?P<noun>1)",
    "PRON": r"(?P<pron>2)",
    "ADJ": r"(?P<adj>3)",
    "ADV": r"(?P<adv>4)",
    "ADP": r"(?P<adp>5)",
    "CONJ": r"(?P<conj>6)",
    "DET": r"(?P<det>7)",
    "NUM": r"(?P<num>8)",
    "PRT": r"(?P<prt>9)",
    "X": r"(?P<x>x)",
    ".": r"(?P<punc>p)"
}

def name_gen(rule):
  regex = r"(?P<{}>{})"
  regex_nr = r"(?P<{}>{}?)"
  regex_s = r"(?P<{}>[0-9px]{{{}}})"
  regex_k = r"(?P<{}>[0-9px])"
  regex_kn = r"(?P<{}>[0-9px]?)"
  ans = []
  for token in rule:
    if token["name"] == "pos":
      if token["required"]:
        ans.append(regex.format(token["index"],tags_dig[token["content"]]))
      else:
        ans.append(regex_nr.format(token["index"],tags_dig[token["content"]]))
    if token["name"] == "any":
      ans.append(r"(?P<{}>[0-9px]*)".format(token["index"]))
    if token["name"] == "spec":
      ans.append(regex_s.format(token["index"],token["len"]))
    if token["name"] == "keywords":
      if token["required"]:
        ans.append(regex_k.format(token["index"]))
      else:
        ans.append(regex_kn.format(token["index"]))
  return "".join(ans)

def check(rule):
  for token in rule:
    if token["name"] == "spec" and token["required"]:
      if lemmatizer.lemmatize("".join(token["match"])) not in token["list"]:
        return False
    if token["name"] == "keywords":
      if "".join(token["match"]) not in webcolors.CSS3_NAMES_TO_HEX and "".join(token["match"]) not in keywords:
        return False
  return True

def match(rule, sentence):
  p = re.compile(name_gen(rule))
  text, tagged = sentenceToString(sentence)
  m = p.finditer(tagged)
  if m:
    for ma in m:
      _rule = rule
      for token in _rule:
        token["match"] = text[ma.start(token["index"]):ma.end(token["index"])]
      if check(_rule,):
        return sentence

  p2 = re.compile(r"(?<=.)" + name_gen(rule))
  m2 = p2.finditer(tagged)

  if m2:
    for ma in m2:
      _rule = rule
      for token in _rule:
        token["match"] = text[ma.start(token["index"]):ma.end(token["index"])]
      if check(_rule,):
        return sentence

def content_driver(option, rule, contentlist):
  if option == "pos":
    return match_from_contentlist(rule, contentlist)
  elif option == "text":
    return filter_from_contentlist(rule, contentlist)
  else:
    print("option: pos or text")

def alt_all(asin):
  data = pd.read_csv("log.csv")
  data = data.loc[data['ASIN'] == asin]
  data["Title"] = data["Title"].fillna("null")
  data["Variant"] = data["Variant"].fillna("null")
  codes, uniques = pd.factorize(data["Variant"])
  var = uniques.to_list()
  alt = {}
  for v in var:
    dd = data[data["Variant"] == v]["Content"].to_list()
    c = content_driver("pos",rule1c,dd)
    if c != []:
        color = c[0]
    else:
        color = None
    c = content_driver("pos",rule1si,dd)
    if c != []:
        size = c[0]
    else:
        size = None
    c = content_driver("pos",rule1s,dd)
    if c != []:
        shape = c[0]
    else:
        shape = None
    alt[v] = {"color":color,"size":size,"shape":shape}
  return alt

def match_from_contentlist(rule, contentlist):
  ans = []
  for review in contentlist:
    try:
      for subsentence in tokenize.sent_tokenize(review):
        m = match(rule,subsentence)
        if m:
          ans.append(m)
    except:
      pass
  return ans

def driver(option, rule, asin):
    print("debug")
    print(rule)
    contentlist = getReviewlist(asin)
    if option == "pos":
        return match_from_contentlist(rule, contentlist)
    elif option == "text":
        return filter_from_contentlist(rule, contentlist)
    else:
        print("option: pos or text")

rule1c = [
  {
    "index": "a",
    "name" : "pos",
    "content": "ADJ",
    "required" : True,
  },
  {
      "index": "c",
      "name": "spec",
      "len": 1,
      "list": ["color"],
      "required" : True
  }
]

rule1s = [
  {
    "index": "a",
    "name" : "pos",
    "content": "ADJ",
    "required" : True,
  },
  {
      "index": "c",
      "name": "spec",
      "len": 1,
      "list": ["shape"],
      "required" : True
  }
]

rule1si = [
  {
    "index": "a",
    "name" : "pos",
    "content": "ADJ",
    "required" : True,
  },
  {
      "index": "c",
      "name": "spec",
      "len": 1,
      "list": ["size"],
      "required" : True
  }
]

apikey = '0a9a7d632971440e9f6f4e46029f96ea'
client = ScrapinghubClient(apikey)
dynamodb = boto3.client('dynamodb')
app = Flask(__name__)
CORS(app)

# nltk.download('punkt')
# nltk.download('averaged_perceptron_tagger')
# nltk.download('wordnet')




# data = pd.read_csv("B074HL534Mreviews.csv")

def colorFilter(data,colorname):
  color = data.loc[data['Color'] == colorname]
  return color
# color = Surf the Web/Patriotic Script

def color_nomatch(data,colorname):
  no_color = data.loc[data['Color'] != colorname]
  return no_color

def split_sentences(sentence):
  # return a list of sentences divided by puncts
  return re.split("[.!?]",sentence)

def get_keywords(sentence):
  r = Rake() # Uses stopwords for english from NLTK, and all puntuation characters.
  r.extract_keywords_from_text(sentence)
  list = []
  for i in r.get_ranked_phrases():
    for j in i.split(' '):
      list.append(j)
  return list

def get_extract(query, content):
  sentences = split_sentences(content)
  keywords = get_keywords(query)
  min_index = None
  max_index = None
  for keyword in keywords:
    for sentence in sentences:
      if keyword.lower() in sentence:
        if min_index == None or max_index == None:
          min_index = sentences.index(sentence)
          max_index = sentences.index(sentence)
        else:
          if (sentences.index(sentence) < min_index):
            min_index = sentences.index(sentence)
          if (sentences.index(sentence) > max_index):
            max_index = sentences.index(sentence)
  result = ""
  if min_index != None and max_index != None:
    for i in range(min_index, max_index+1):
      result += sentences[i]
  return result



def contain_keywords(keywords, string):
  try:
    for keyword in keywords:
      if keyword.lower() in string:
        return True
  except:
    return False
  return False

def keywords_count(keywords,string):
  try:
    count = 0
    nkey = len(keywords)
    for keyword in keywords:
      if keyword.lower() in string:
        count += 1
    if (nkey != 0):
      return count / nkey
    else:
      return 0
  except:
    return 0




def title_score(data, keywords):
    try:
        return keywords_count(keywords, data['Title']) * 100
    except:
        return 0


def assign_title_score(df, keywords):
    return df.apply(title_score, axis=1, keywords=keywords)


def reviews_score(data, keywords):
    try:
        return keywords_count(keywords, data['Content']) * 100
    except:
        return 0


def assign_reviews_score(df, keywords):
    return df.apply(reviews_score, axis=1, keywords=keywords)


def helpful_score(data, max):
    try:
        if max != 0:
            score = data['Helpful'] / max
        else:
            score = 0
        return score
    except:
        return 0


def assign_helpful_score(df):
    return df.apply(helpful_score, axis=1, max=df['Helpful'].max())


def get_extract_df(data, query):
    return get_extract(query, data['Content'])


# data2.apply(get_extract_df,axis=1,query="color")


def short_score(data):
    try:
        l = len(re.findall(r'\w+', data['Content']))
        if (l > 4 and l < 15):
            return 10
        else:
            return 0
    except:
        return 0


def assign_all_scores(data, keywords):
    data["Score"] = assign_title_score(data, keywords)
    data["Score"] += assign_reviews_score(data, keywords)
    # data["Score"] += assign_helpful_score(data)
    data["Score"] += data.apply(short_score, axis=1)
    return data.sort_values('Score', ascending=False)



def get_v_sum(asin, sentence):
    keywords =  get_keywords(sentence)
    vlist = ['color','shape','size']
    ruledict ={
        'color' : rule1c,
        'shape' : rule1s,
        'size' : rule1si
    }
    vs = {}

    for key in vlist:
        if key in keywords:
            r = driver("pos", ruledict[key], asin)
            if r != []:
                if len(r) < 3:
                    sent = r
                else:
                    sent = r[:3]

            else:
                sent = None
            vs[key] = sent
    return vs


def get_result(asin, sentence):
    # name = asin+"reviews.csv"
    data = pd.read_csv("log.csv")

    # filter selected ASIN
    data = data.loc[data['ASIN'] == asin]

    data = data[['Title', 'Content', "Rating"]]
    # data["Color"] = data["Color"].fillna("null")

    data["Title"] = data["Title"].fillna("null")
    data["Content"] = data["Content"].fillna("null")
    data["Rating"] = data["Rating"].fillna(0)

    # data["Helpful"] = data["Helpful"].fillna(0)


    d1 = assign_all_scores(data, get_keywords(sentence))
    # d2 = assign_all_scores(otherdata, get_keywords(sentence))
    # print("%%%%%%%")
    # print(d1.Rating)


    poslistm = d1[d1.Rating.astype(float) >= 3][d1.Score >= 100]
    # poslistm['extract'] = poslistm.apply(get_extract_df, axis=1, query=sentence)
    neglistm = d1[d1.Rating.astype(float) < 3][d1.Score >= 100]
    # neglistm['extract'] = neglistm.apply(get_extract_df, axis=1, query=sentence)
    # poslistn = d2[d2.Stars >= 3][d2.Score >= 100]
    # neglistn = d2[d2.Stars < 3][d2.Score >= 100]
    # print(poslistm)
    return({"poslistm":poslistm, "neglistm":neglistm})



def summary_test(asin,sentence):
    result = get_result(asin, sentence)
    poslistm = result["poslistm"].to_dict('records')
    # poslistn = result["poslistn"].to_dict('records')
    neglistm = result["neglistm"].to_dict('records')
    # neglistn = result["neglistn"].to_dict('records')

    # attribute = ""
    keywords = get_keywords(sentence)

    result = ""

    result = result + "I got " + str(len(poslistm)+len(neglistm)) + " related reviews, " + str(len(poslistm)) + " are positive "
    if (len(poslistm) < 3):
        if (len(poslistm) != 0):
            result += " including "
        for i in range(len(poslistm)):
            result +=  str(poslistm[i]["Content"])
            if i != len(neglistm):
                result += " and "
    else:
        result = result + " including " + str(poslistm[0]["Content"]) + " and " + str(poslistm[1]["Content"]) + " and " + str(poslistm[2]["Content"])


    result = result + str(len(neglistm)) + " are negative, mentioned that "

    if (len(neglistm) < 3):
        if (len(neglistm) != 0):
            result += " including "
        for i in range(len(neglistm)):
            result += str(neglistm[i]["Content"])
            if i != len(neglistm):
                result += " and "
    else:
        result = result + " including " + str(neglistm[0]["Content"]) + " and " + str(
            neglistm[1]["Content"]) + " and " + str(neglistm[2]["Content"])

    result2 = {}

    result2["intro1"] =  "I got " + str(len(poslistm)+len(neglistm)) + " related reviews, " + str(len(poslistm)) + " are positive:"
    result2["pos"] = []
    if (len(poslistm) < 3):
        for i in range(len(poslistm)):
            result2["pos"].append(get_extract(sentence,str(poslistm[i]["Content"])))
    else:
        for i in range(3):
            result2["pos"].append(get_extract(sentence,str(poslistm[i]["Content"])))

    result2["intro2"] = str(len(neglistm)) + " are negative, mentioned that:"

    result2["neg"] = []
    if (len(neglistm) < 3):
        for i in range(len(neglistm)):
            result2["neg"].append(get_extract(sentence,str(neglistm[i]["Content"])))
    else:
        for i in range(3):
            result2["neg"].append(get_extract(sentence,str(neglistm[i]["Content"])))


    if len(poslistm) > 20:
        poslistm = poslistm[:20]

    if len(neglistm) > 20:
        neglistm = neglistm[:20]

    return ({"poslistm":poslistm, "neglistm":neglistm,"summary1":result,"summaryT":result2,"keywordlist":keywords,"vsum":get_v_sum(asin, sentence)})

def send_request(asin):
    reviewsnum = None
    while reviewsnum == None:
        try:
            response = requests.get(
                url="https://api.proxycrawl.com/",
                params={
                    "token": "KNGLScDpHQFg_gzSN6u22Q",
                    "url": "https://www.amazon.com/product-reviews/"+ asin +"/ref=cm_cr_getr_d_paging_btm_next_2?ie=UTF8&reviewerType=all_reviews&pageNumber=1",
                },

            )
            # print('Response HTTP Status Code: ', response.status_code)
            # print('Response HTTP Response Body: ', response.content)
            soup = BeautifulSoup(response.content, 'html.parser')

            reviewsnum = soup.find_all('span', {'data-hook': "cr-filter-info-review-count"})[0].text.strip()
            reviewsnum = re.search('(?<=of )(.*)(?= reviews)', reviewsnum).group(1)
            reviewsnum = int(reviewsnum.replace(',', ''))
        except:
            pass

    # print(part,num_p)
    return reviewsnum


def pages(num):
  if num % 10 == 0:
    return num // 10
  else:
    return num // 10 + 1



def download(asin):

    flag = False
    try:
        data = pd.read_csv("info.csv")
        if asin in data["ASIN"].values:
            flag = True
    except:
        flag = False



    if flag:
        title = data[data["ASIN"] == asin]["Title"].values[0]
        des = data[data["ASIN"] == asin]["Description"].values[0]
        img = data[data["ASIN"] == asin]["Image"].values[0]
        pri = data[data["ASIN"] == asin]["Price"].values[0]

        return {'title': title, 'des': des, 'img': img, 'pri': pri,'alt':alt_all(asin)}
    else:
        reviewsnum = send_request(asin)
        pgs = pages(reviewsnum)
        if pgs <= 4:
            spiders = pgs
            project1 = client.get_project(464700)
            count = project1.jobs.summary()[2]['count']
            project1.jobs.run('product', units=1, job_args={'asin': asin})
            time1 = time.time()
            pflag = True
            while (pflag):
                if time.time() - time1 > 300:
                    pflag = False
                if project1.jobs.summary()[2]['count'] == count + 1:
                    response = dynamodb.scan(
                        TableName="Askit_Product",
                        Select='ALL_ATTRIBUTES')
                    data = response['Items']
                    while 'LastEvaluatedKey' in response:
                        response = dynamodb.scan(
                            TableName='Askit_Product',
                            Select='ALL_ATTRIBUTES',
                            ExclusiveStartKey=response['LastEvaluatedKey'])
                        data.extend(response['Items'])
                    header = ['ASIN', 'Title', 'Description', 'Image', 'Price']
                    with open('info.csv', 'wt') as f:
                        csv_writer = csv.writer(f)
                        csv_writer.writerow(header)  # write header

                        for product in data:
                            # print(review)
                            asin_2 = None
                            title_product = None
                            des = None
                            image = None
                            pri = None

                            if product["Image"].get("S"):
                                image = product["Image"]["S"]
                            if product["Title"].get("S"):
                                title = product["Title"]["S"]
                            if product["ASIN"].get("S"):
                                asin_2 = product["ASIN"]["S"]
                            if product["Description"].get("S"):
                                des = product["Description"]["S"]
                            if product["Price"].get("S"):
                                pri = product["Price"]["S"]

                            csv_writer.writerow([asin_2, title, des, image, pri])
                    pflag = False


            project = client.get_project(461248)

            part = reviewsnum // spiders
            num_p = reviewsnum - part * (spiders - 1)
            num = 1

            count = project.jobs.summary()[2]['count']

            for i in range(spiders-1):
                project.jobs.run('amazon', units=1, job_args={'asin': asin, 'start': num, 'end': (i + 1) * part + 1})
                num = num + part
            project.jobs.run('amazon', units=1, job_args={'asin': asin, 'start': num + part, 'end': num_p + 1})


            time1 = time.time()
            while (time.time() - time1 < 300):
                if project.jobs.summary()[2]['count'] == count + spiders:
                    response = dynamodb.scan(
                        TableName="Askit3",
                        Select='ALL_ATTRIBUTES')
                    data = response['Items']
                    while 'LastEvaluatedKey' in response:
                        response = dynamodb.scan(
                            TableName='Askit3',
                            Select='ALL_ATTRIBUTES',
                            ExclusiveStartKey=response['LastEvaluatedKey'])

                        data.extend(response['Items'])
                    header = ['ASIN', 'Title', 'Date', 'Variant', 'Content', 'Rating', 'Auther']
                    with open('log.csv', 'wt') as f:
                        csv_writer = csv.writer(f)
                        csv_writer.writerow(header)  # write header

                        for review in data:
                            # print(review)
                            asin_2 = None
                            title = None
                            date = None
                            variant = None
                            content = None
                            rating = None
                            auther = None
                            if review["Variant"].get("S"):
                                variant = review["Variant"]["S"]
                            if review["Title"].get("S"):
                                title = review["Title"]["S"]
                            if review["ASIN"].get("S"):
                                asin_2 = review["ASIN"]["S"]
                            if review["Date"].get("S"):
                                date = review["Date"]["S"]
                            if review["Content"].get("S"):
                                content = review["Content"]["S"]
                            if review["Rating"].get("S"):
                                rating = review["Rating"]["S"]
                            if review["Auther"].get("S"):
                                auther = review["Auther"]["S"]
                            # print(review["Variant"]["S"])
                            csv_writer.writerow([asin_2, title, date, variant, content, rating, auther])
                    return {'title':title_product, 'des':des, 'img':image, 'pri':pri}
            return False

        else:
            spiders = 5
            project1 = client.get_project(464700)
            count = project1.jobs.summary()[2]['count']
            project1.jobs.run('product', units=1, job_args={'asin': asin})
            time1 = time.time()
            pflag = True
            while (pflag):
                if time.time() - time1 > 300:
                    pflag = False
                if project1.jobs.summary()[2]['count'] == count + 1:
                    response = dynamodb.scan(
                        TableName="Askit_Product",
                        Select='ALL_ATTRIBUTES')
                    data = response['Items']
                    while 'LastEvaluatedKey' in response:
                        response = dynamodb.scan(
                            TableName='Askit_Product',
                            Select='ALL_ATTRIBUTES',
                            ExclusiveStartKey=response['LastEvaluatedKey'])
                        data.extend(response['Items'])
                    header = ['ASIN', 'Title', 'Description', 'Image', 'Price']
                    with open('info.csv', 'wt') as f:
                        csv_writer = csv.writer(f)
                        csv_writer.writerow(header)  # write header

                        for product in data:
                            # print(review)
                            asin_2 = None
                            title = None
                            des = None
                            image = None
                            pri = None

                            if product["Image"].get("S"):
                                image = product["Image"]["S"]
                            if product["Title"].get("S"):
                                title = product["Title"]["S"]
                            if product["ASIN"].get("S"):
                                asin_2 = product["ASIN"]["S"]
                            if product["Description"].get("S"):
                                des = product["Description"]["S"]
                            if product["Price"].get("S"):
                                pri = product["Price"]["S"]

                            csv_writer.writerow([asin_2, title, des, image, pri])
                    pflag = False

            part = reviewsnum // 5
            num_p = reviewsnum - part * 4
            num = 1

            project = client.get_project(461248)
            count = project.jobs.summary()[2]['count']

            for i in range(spiders-1):
                project.jobs.run('amazon', units=1, job_args={'asin': asin, 'start': num, 'end': (i + 1) * part + 1})
                num = num + part
            project.jobs.run('amazon', units=1, job_args={'asin': asin, 'start': num + part, 'end': num_p + 1})

            time1 = time.time()
            while (time.time()-time1 < 1000):
                if project.jobs.summary()[2]['count'] == count + 4:
                    response = dynamodb.scan(
                        TableName="Askit3",
                        Select='ALL_ATTRIBUTES')
                    data = response['Items']
                    while 'LastEvaluatedKey' in response:
                        response = dynamodb.scan(
                            TableName='Askit3',
                            Select='ALL_ATTRIBUTES',
                            ExclusiveStartKey=response['LastEvaluatedKey'])

                        data.extend(response['Items'])
                    header = ['ASIN', 'Title', 'Date', 'Variant', 'Content', 'Rating', 'Auther']
                    with open('log.csv', 'wt') as f:
                        csv_writer = csv.writer(f)
                        csv_writer.writerow(header)  # write header

                        for review in data:
                            # print(review)
                            asin_2 = None
                            title = None
                            date = None
                            variant = None
                            content = None
                            rating = None
                            auther = None
                            if review["Variant"].get("S"):
                                variant = review["Variant"]["S"]
                            if review["Title"].get("S"):
                                title = review["Title"]["S"]
                            if review["ASIN"].get("S"):
                                asin_2 = review["ASIN"]["S"]
                            if review["Date"].get("S"):
                                date = review["Date"]["S"]
                            if review["Content"].get("S"):
                                content = review["Content"]["S"]
                            if review["Rating"].get("S"):
                                rating = review["Rating"]["S"]
                            if review["Auther"].get("S"):
                                auther = review["Auther"]["S"]
                            # print(review["Variant"]["S"])
                            csv_writer.writerow([asin_2, title, date, variant, content, rating, auther])
                    if driver("pos", rule1c, asin) != []:
                        color = driver("pos", rule1c, asin)[0]
                    else:
                        color = None

                    if driver("pos", rule1si, asin) != []:
                        size = driver("pos", rule1si, asin)[0]
                    else:
                        size = None

                    if driver("pos", rule1s, asin) != []:
                        shape = driver("pos", rule1s, asin)[0]
                    else:
                        shape = None

                    alt = {"color": color, "size": size, "shape": shape}
                    return {'title':title, 'des':des, 'img':image, 'pri':pri, 'alt': alt}
        return False

@app.route('/<asin>/<query>')
def show_post(asin, query):
    return {"answer":summary_test(asin, query)},{'Access-Control-Allow-Origin': '*'}

@app.route('/download/<asin>')
def view(asin):
    return {"success":download(asin)},{'Access-Control-Allow-Origin': '*'}

@app.route('/info/<asin>')
def info(asin):
    return {"success":download(asin)},{'Access-Control-Allow-Origin': '*'}


@app.route("/xz/<asin>", methods=['GET'])
def download_file(asin):
    if (download(asin)):
        directory = os.getcwd()
        return send_from_directory(directory, "log.csv", as_attachment=True)
    else:
        return {"Error"}


if __name__ == '__main__':
    app.run(debug=False)

# testdriver()


