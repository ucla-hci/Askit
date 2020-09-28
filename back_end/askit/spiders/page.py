import scrapy
import re
from scrapy.shell import inspect_response

from proxycrawl.proxycrawl_api import ProxyCrawlAPI

# Get the API token from ProxyCrawl and replace it with YOUR_TOKEN
api = ProxyCrawlAPI({ 'token': 'KNGLScDpHQFg_gzSN6u22Q' })

class ProductSpider(scrapy.Spider):

    name = 'product'
    custom_settings = {
        'ITEM_PIPELINES': {
        }
    }
    def __init__(self, *args, **kwargs):
        super(ProductSpider, self).__init__(*args, **kwargs)
        # Amazon search result URLs
        urls = []
        newpage = 'https://www.amazon.com/dp/' + kwargs.get('asin') + '/'
        urls.append(newpage)
        # make the URLS to go through PROXYCRAWL API
        self.start_urls = list(map(lambda url: api.buildURL(url, {}), urls))


    def parse(self, response):
        # inspect_response(response, self)
        url = response.request.url
        asin = re.search(r"(%2F)([A-Z0-9]{10})(%2F)",url).group(2)

        yield  {
            "ASIN" : asin,
            "Title": response.xpath('//h1[@id="title"]/span/text()').get().replace("\n","").replace("\t",""),
            "Price" : response.xpath('//span[contains(@id,"ourprice") or contains(@id,"saleprice")]/text()').get().replace("\n","").replace("\t",""),
            "Description": "^".join([ item.replace("\n","").replace("\t","") for item in response.xpath('//div[@id="feature-bullets"]/ul/li/span/text()').extract()]),
            "Image": response.xpath('//div[@class="imgTagWrapper"]/img/@data-old-hires').get().replace("\n","").replace("\t","")
        }

