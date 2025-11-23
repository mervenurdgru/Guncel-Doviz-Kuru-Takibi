using Microsoft.AspNetCore.Mvc;
using DovizTakipApi.Data;
using DovizTakipApi.Models;
using System.Linq;

namespace DovizTakipApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FavoritesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FavoritesController(AppDbContext context)
        {
            _context = context;
        }

        // 1. FAVORİLERİ GETİR
        [HttpGet]
        public IActionResult GetFavorites()
        {
            // Sadece kodları (USD, EUR) liste olarak döndürür
            var favorites = _context.FavoriteCurrencies
                                    .Select(f => f.CurrencyCode)
                                    .ToList();
            return Ok(favorites);
        }

        // 2. FAVORİ EKLE
        [HttpPost]
        public IActionResult AddFavorite([FromBody] FavoriteCurrency model)
        {
            // Zaten ekli mi kontrol et
            var exists = _context.FavoriteCurrencies
                .Any(f => f.CurrencyCode == model.CurrencyCode);

            if (!exists)
            {
                _context.FavoriteCurrencies.Add(model);
                _context.SaveChanges();
            }
            
            return Ok(new { message = "Eklendi" });
        }

        // 3. FAVORİ SİL (İŞTE BU METOT EKSİKSE SİLME ÇALIŞMAZ)
        [HttpDelete("{code}")]
        public IActionResult RemoveFavorite(string code)
        {
            // Veritabanında bu kodu bul (Örn: USD)
            var fav = _context.FavoriteCurrencies
                .FirstOrDefault(f => f.CurrencyCode == code);

            if (fav != null)
            {
                _context.FavoriteCurrencies.Remove(fav);
                _context.SaveChanges();
                return Ok(new { message = "Silindi" });
            }

            return NotFound(new { message = "Bulunamadı" });
        }
    }
}