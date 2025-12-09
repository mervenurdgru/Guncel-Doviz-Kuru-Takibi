using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DovizTakipApi.Models
{
    public class FavoriteCurrency
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(5)] 
        public string CurrencyCode { get; set; } = string.Empty;

        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }
    }
}