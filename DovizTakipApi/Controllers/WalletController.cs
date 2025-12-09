using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DovizTakipApi.Models;
using DovizTakipApi.Data; 
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace DovizTakipApi.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    [Authorize] 
    public class WalletController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WalletController(AppDbContext context)
        {
            _context = context;
        }

        private int GetCurrentUserId()
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            
            if (idClaim == null)
            {
                return 0; 
            }
            return int.Parse(idClaim.Value);
        }

        [HttpGet]
        public async Task<IActionResult> GetWallet()
        {
            int userId = GetCurrentUserId(); 

            var wallet = await _context.Wallets
                                       .Where(x => x.UserId == userId)
                                       .ToListAsync();
            return Ok(wallet);
        }

        [HttpPost]
        public async Task<IActionResult> AddToWallet([FromBody] Wallet model)
        {
            int userId = GetCurrentUserId(); 

            if (userId == 0) return Unauthorized("Kullanıcı bulunamadı.");

            var existingItem = await _context.Wallets.FirstOrDefaultAsync(x => x.UserId == userId && x.CurrencyCode == model.CurrencyCode);
            
            if (model.Amount < 0)
            {
                if (existingItem == null)
                {
                    return BadRequest($"Cüzdanınızda hiç {model.CurrencyCode} yok, satış yapamazsınız!");
                }
                if (existingItem.Amount + model.Amount < 0)
                {
                    return BadRequest($"Yetersiz Bakiye! Mevcut: {existingItem.Amount} {model.CurrencyCode}");
                }
            }

            if (existingItem != null)
            {
                existingItem.Amount += model.Amount;
                existingItem.LastUpdated = DateTime.UtcNow;
                
                if (existingItem.Amount == 0) _context.Wallets.Remove(existingItem);
            }
            else
            {
                var newWalletItem = new Wallet
                {
                    UserId = userId,
                    CurrencyCode = model.CurrencyCode,
                    Amount = model.Amount,
                    LastUpdated = DateTime.UtcNow
                };
                _context.Wallets.Add(newWalletItem);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "İşlem Başarılı" });
        }

        [HttpDelete("{code}")]
        public async Task<IActionResult> RemoveFromWallet(string code)
        {
            int userId = GetCurrentUserId(); 

            var item = await _context.Wallets.FirstOrDefaultAsync(x => x.UserId == userId && x.CurrencyCode == code);
            
            if (item == null) return NotFound("Bu döviz cüzdanınızda yok.");

            _context.Wallets.Remove(item);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Silindi" });
        }
    }
}