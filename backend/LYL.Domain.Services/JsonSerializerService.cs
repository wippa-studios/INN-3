using System;
using LYL.Domain.Services;
using LYL.Domain.Model;
using LYL.Domain.Services.Interfaces;
using System.Text.Json;
using LYL.Domain.Model.JsonModel;
using LYL.Persistence.Interfaces;
using LYL.Persistence;


namespace LYL.Domain.Services;

public class JsonSerializerService(IJsonReaderRepository repo, IInMemoryDataRepository repoData) : IJsonSerializerService
{
    public List<Character> getCharacters()
    {
        var characters = repoData.getCharacters();
         return characters;
     }
    
    public List<Partner> GetPartners()
    {
       return repoData.GetPartners();
    }

    public bool SerializeAllJsonFiles()
    {
        try
        {
            var result = repo.GetJsonFiles();
            if (result is null) throw new Exception("Json file was not read correctly");
            
            var schoneData = result.ToDictionary(
                            item => item.Key.ToString(),
                            item => JsonDocument.Parse(item.Value)
                        );

            repoData.FillInMemoryData(schoneData);
            return true;

        }
        catch 
        { 
            return false; //TODO exception?
        }
    }
    

}
