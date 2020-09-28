import scrapy
import re
from scrapy.shell import inspect_response

from proxycrawl.proxycrawl_api import ProxyCrawlAPI

# # Get the API token from ProxyCrawl and replace it with YOUR_TOKEN
# api = ProxyCrawlAPI({ 'token': 'KNGLScDpHQFg_gzSN6u22Q' })

class AmazonSpider(scrapy.Spider):

    name = 'amazon'

    def __init__(self, *args, **kwargs):
        super(AmazonSpider, self).__init__(*args, **kwargs)

        # Amazon search result URLs
        urls = []
        for i in range(kwargs.get('start'), kwargs.get('end')):
            newpage = 'https://www.amazon.com/product-reviews/' + kwargs.get('asin') + '/ref=cm_cr_getr_d_paging_btm_next_2?ie=UTF8&reviewerType=all_reviews&pageNumber=' + str(
                i)
            urls.append(newpage)
        # make the URLS to go through PROXYCRAWL API
        api = ProxyCrawlAPI({'token': kwargs.get('api')})
        self.start_urls = list(map(lambda url: api.buildURL(url, {}), urls))




    def parse(self, response):
        # inspect_response(response, self)

        url = response.request.url
        # print("*********")
        # print(url)

        asin = re.search(r"(%2F)([A-Z0-9]{10})(%2F)",url).group(2)


        for review in response.css('div.review div.a-section.celwidget'):
            yield  {
                "ASIN" : asin,
                "Title" : review.css('a.review-title').css('span::text').get(),
                "Content": review.css('div.a-row.review-data span.review-text span').css('span::text').get(),
                "Date": review.css('span.a-size-base.a-color-secondary::text').get(),
                "Auther":review.css('span.a-profile-name::text').get(),
                "Variant": review.css('a.a-size-mini::text').get(),
                "Rating" : re.match(r"^.{3}",review.css('div.a-row:nth-of-type(2) > a.a-link-normal:nth-of-type(1)::attr(title)').get())[0]
            }

