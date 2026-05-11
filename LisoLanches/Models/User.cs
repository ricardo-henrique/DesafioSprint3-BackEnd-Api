using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace LisoLanches.Models;

public class User : IdentityUser
{
    [Required, MaxLength(50)]
    public string FirstName { get; set; } = string.Empty;

    [Required, MaxLength(50)]
    public string LastName { get; set; } = string.Empty;

    public List<Order> Orders { get; set; } = new();
}
