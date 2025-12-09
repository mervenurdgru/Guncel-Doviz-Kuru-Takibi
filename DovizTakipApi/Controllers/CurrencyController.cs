using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;
using System.Xml.Linq;
using System.Linq;
using System.Globalization;
using System;
using System.Collections.Generic;

namespace DovizTakipApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CurrencyController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public CurrencyController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        public class CurrencyRate
        {
            public string Code { get; set; } = string.Empty;
            public string Name { get; set; } = string.Empty;
            public decimal ForexBuying { get; set; }
            public decimal ForexSelling { get; set; }
        }

        [HttpGet("latest")]
        public async Task<IActionResult> GetLatestRates()
        {
            try
            {
                var client = _httpClientFactory.CreateClient();
                var response = await client.GetAsync("https://www.tcmb.gov.tr/kurlar/today.xml");

                if (!response.IsSuccessStatusCode) return StatusCode((int)response.StatusCode, "TCMB hatası");

                var xmlStream = await response.Content.ReadAsStreamAsync();
                var xmlDoc = XDocument.Load(xmlStream);

                var rates = xmlDoc.Descendants("Currency")
                    .Where(c => c.Attribute("Kod")?.Value == "USD" ||
                                c.Attribute("Kod")?.Value == "EUR" ||
                                c.Attribute("Kod")?.Value == "GBP")
                    .Select(c => new CurrencyRate
                    {
                        Code = c.Attribute("Kod")!.Value,
                        Name = c.Element("Isim")!.Value,
                        ForexBuying = decimal.Parse(c.Element("ForexBuying")!.Value, CultureInfo.InvariantCulture),
                        ForexSelling = decimal.Parse(c.Element("ForexSelling")!.Value, CultureInfo.InvariantCulture)
                    }).ToList();

                return Ok(rates);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Sunucu Hatası: " + ex.Message);
            }
        }
[HttpGet("history/weekly/{code}")]
public IActionResult GetWeeklyHistory(string code)
{
    var random = new Random();
    var history = new List<object>();
    double basePrice = code == "USD" ? 34.20 : (code == "EUR" ? 36.70 : 42.00);

    for (int i = 6; i >= 0; i--) 
    {
        double price = basePrice + (random.NextDouble() * 1.5) - 0.75;
        history.Add(new 
        { 
            Date = DateTime.Now.AddDays(-i).ToString("dd.MM"), 
            Price = Math.Round(price, 4) 
        });
    }
    return Ok(history);
}
        [HttpGet("history/monthly/{code}")]
        public IActionResult GetMonthlyHistory(string code)
        {
            var random = new Random();
            var history = new List<object>();
            double basePrice = code == "USD" ? 34.20 : (code == "EUR" ? 36.70 : 42.00);

            for (int i = 29; i >= 0; i--) 
            {
                double price = basePrice + (random.NextDouble() * 3.0) - 1.5;
                history.Add(new 
                { 
                    Date = DateTime.Now.AddDays(-i).ToString("dd.MM.yyyy"), 
                    Price = Math.Round(price, 4) 
                });
            }
            return Ok(history);
        }
    }
}