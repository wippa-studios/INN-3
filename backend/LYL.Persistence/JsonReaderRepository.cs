using Dapper;
using LYL.Persistence.Interfaces;
using Npgsql;

namespace LYL.Persistence;

public class JsonReaderRepository : IJsonReaderRepository
{
    private readonly string _connectionString;

    public JsonReaderRepository(string connectionString)
    {
        _connectionString = connectionString;
    }

    public Dictionary<string, string> GetJsonFiles()
    {
        string connectionstring = _connectionString;

        string query = @"select filename, jsonfile from testlyljson.jsonfiles";
        //TODO check in db if id, filename and jsonfile in column (give new name) + change name in query

        try
        {
            using var connection = new NpgsqlConnection(connectionstring);

            var result = connection.Query(query)
                .ToDictionary(
                    x => (string)x.filename, //key
                    x => (string)x.jsonfile
                );

            return result;
        }
        catch { return null; }


    }

}
