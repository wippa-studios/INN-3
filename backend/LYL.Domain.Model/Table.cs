using System;

namespace LYL.Domain.Model;

public class Table
{
    public Guid TableId { get; set; }

    public int TableNumber { get; set; }

    // Lockobject is for tryaddplayer method
    private readonly object lockObject = new object();
    private readonly List<Player> players = new();
    public IReadOnlyList<Player> Players => players.AsReadOnly();
    public bool IsFull => players.Count >= 5;
    public List<Character> Characters { get; set; } = new();

    public bool TryAddPlayer(Player player)
    {
        // lock makes sure the thread is secured for only one player (prevents race conditions)
        lock (lockObject)
        {
            if (IsFull) return false;

            players.Add(player);
            return true;
        }
    }

    public void RemovePlayer(Player player)
    {
        lock (lockObject)
        {
            players.Remove(player);
        }
    }

    public void AssignCharactersToPlayers(List<Partner> partners)
    {
        lock (lockObject)
        {
            var random = new Random();
            var shuffledCharacters = Characters.OrderBy(x => random.Next()).ToList();

            for (int i = 0; i < players.Count; i++)
            {
                players[i].AssignCharacter(shuffledCharacters[i], partners);
            }
        }
    }
}
