using Microsoft.AspNetCore.Mvc;
using DovizTakipApi.Data;
using DovizTakipApi.Models;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace DovizTakipApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] 
    public class FavoritesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FavoritesController(AppDbContext context)
        {
            _context = context;
        }

        private int GetUserId()
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (idClaim != null)
            {
                return int.Parse(idClaim.Value);
            }
            return 0; 
        }

        [HttpGet]
        public IActionResult GetFavorites()
        {
            int userId = GetUserId();

            var favorites = _context.FavoriteCurrencies
                                    .Where(f => f.UserId == userId)
                                    .Select(f => f.CurrencyCode)
                                    .ToList();
            return Ok(favorites);
        }

        [HttpPost]
        public IActionResult AddFavorite([FromBody] FavoriteCurrency model)
        {
            int userId = GetUserId();

            var exists = _context.FavoriteCurrencies
                .Any(f => f.CurrencyCode == model.CurrencyCode && f.UserId == userId);

            if (!exists)
            {

                model.UserId = userId; 
                
                _context.FavoriteCurrencies.Add(model);
                _context.SaveChanges();
            }
            
            return Ok(new { message = "Eklendi" });
        }

        [HttpDelete("{code}")]
        public IActionResult RemoveFavorite(string code)
        {
            int userId = GetUserId();

            var fav = _context.FavoriteCurrencies
                .FirstOrDefault(f => f.CurrencyCode == code && f.UserId == userId);

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