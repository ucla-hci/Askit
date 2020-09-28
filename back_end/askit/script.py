import scrapy
from scrapy.crawler import CrawlerProcess


process = CrawlerProcess()
process.crawl("amazon",api="KNGLScDpHQFg_gzSN6u22Q",asin="B073ZRXLVF",start=1,end=20)
# process.crawl(MySpider2)
process.start() # the script will block here until all crawling jobs are finished