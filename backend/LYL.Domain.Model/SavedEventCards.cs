namespace LYL.Domain.Model;

public class SavedEventCards
{
    public List<EventCardChoices> Choices { get; set; }
}

public class EventCardChoices
{
   
    public string CardId { get; set; }
    public string? ConditionId { get; set; }
}