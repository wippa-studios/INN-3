using System;
using LYL.Domain.Model;

namespace LYL.Domain.Services.Interfaces;

public interface IJsonSerializerService
{
    bool SerializeAllJsonFiles();
    List<Character> getCharacters();
    List<Partner> GetPartners();
}
