javascript:(function()%7Bvar%20PriceTracker%3Dwindow.PriceTracker%7C%7C%7B%7D%3BPriceTracker.escapeHtmlEntities%3Dfunction(e)%7Breturn(e%2B%22%22).replace(%2F%26%2Fg%2C%22%26amp%3B%22).replace(%2F%3C%2Fg%2C%22%26lt%3B%22).replace(%2F%3E%2Fg%2C%22%26gt%3B%22).replace(%2F%22%2Fg%2C%22%26quot%3B%22)%7D%2CPriceTracker.load%3Dfunction()%7Balert(this.escapeHtmlEntities(document.title))%7D%2CPriceTracker.load()%3B%7D)()