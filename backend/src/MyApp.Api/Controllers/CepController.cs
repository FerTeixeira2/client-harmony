using Microsoft.AspNetCore.Mvc;

namespace MyApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CepController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;

    public CepController(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    [HttpGet]
    public async Task<IActionResult> GetByCep([FromQuery] string cep, CancellationToken cancellationToken = default)
    {
        var clean = new string(cep.Where(char.IsDigit).ToArray());
        if (clean.Length != 8)
            return BadRequest(new { message = "CEP deve conter 8 dígitos." });

        var client = _httpClientFactory.CreateClient();

        // 1) Tentar ViaCEP
        try
        {
            var viaCepUrl = $"https://viacep.com.br/ws/{clean}/json/";
            var viaRes = await client.GetAsync(viaCepUrl, cancellationToken);
            if (viaRes.IsSuccessStatusCode)
            {
                var viaJson = await viaRes.Content.ReadFromJsonAsync<ViaCepResponse>(cancellationToken);
                if (viaJson != null && viaJson.Erro != true)
                    return Ok(new CepResponse
                    {
                        Logradouro = viaJson.Logradouro ?? "",
                        Complemento = viaJson.Complemento ?? "",
                        Bairro = viaJson.Bairro ?? "",
                        Localidade = viaJson.Localidade ?? "",
                        Uf = viaJson.Uf ?? ""
                    });
            }
        }
        catch
        {
        }

        try
        {
            var brasilApiUrl = $"https://brasilapi.com.br/api/cep/v1/{clean}";
            var brasilRes = await client.GetAsync(brasilApiUrl, cancellationToken);
            if (brasilRes.IsSuccessStatusCode)
            {
                var brasil = await brasilRes.Content.ReadFromJsonAsync<BrasilApiCepResponse>(cancellationToken);
                if (brasil != null)
                    return Ok(new CepResponse
                    {
                        Logradouro = brasil.Street ?? "",
                        Complemento = "",
                        Bairro = brasil.Neighborhood ?? "",
                        Localidade = brasil.City ?? "",
                        Uf = brasil.State ?? ""
                    });
            }
        }
        catch
        {
        }

        return NotFound(new { message = "CEP não encontrado." });
    }

    private class ViaCepResponse
    {
        public string? Logradouro { get; set; }
        public string? Complemento { get; set; }
        public string? Bairro { get; set; }
        public string? Localidade { get; set; }
        public string? Uf { get; set; }
        public bool? Erro { get; set; }
    }

    private class BrasilApiCepResponse
    {
        public string? Street { get; set; }
        public string? Neighborhood { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
    }

    public class CepResponse
    {
        public string Logradouro { get; set; } = "";
        public string Complemento { get; set; } = "";
        public string Bairro { get; set; } = "";
        public string Localidade { get; set; } = "";
        public string Uf { get; set; } = "";
    }
}
