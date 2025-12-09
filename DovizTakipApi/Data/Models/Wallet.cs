using Microsoft.EntityFrameworkCore; 
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DovizTakipApi.Models
{
    [Index(nameof(UserId), nameof(CurrencyCode), IsUnique = true)] 
    public class Wallet
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; } 

        [Required]
        [MaxLength(3)] 
        public string CurrencyCode { get; set; } = string.Empty; 

        [Column(TypeName = "decimal(18, 4)")] 
        public decimal Amount { get; set; } = 0; 
        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;

        [ForeignKey("UserId")]
        public User? User { get; set; }
    }
}