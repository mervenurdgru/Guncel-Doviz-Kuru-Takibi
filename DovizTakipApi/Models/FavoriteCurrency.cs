// Models/FavoriteCurrency.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DovizTakipApi.Models
{
    public class FavoriteCurrency
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(5)] // "USD", "EUR" gibi kodlar için
        public string CurrencyCode { get; set; } = string.Empty;

        // --- İlişki (Relationship) ---

        // Bu favorinin hangi kullanıcıya ait olduğunu belirten Foreign Key
        public int UserId { get; set; }
        
        // Navigation property (User tablosuna bağlantı)
        [ForeignKey("UserId")]
        public User? User { get; set; }
    }
}