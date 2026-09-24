using System;

namespace LYL.Domain.Model;

public class LivingSituation
{
    public int Children {get; set;}
    public Partner Partner {get; set;}
    public List<Partner> AllPartners {get; set;}
    public bool IsShown = false;
    private Random random = new Random();

    public LivingSituation(List<Partner> partners)
    {
        AllPartners = partners;
        AssignChildren();
        AssignPartner();
    }

    public void AssignPartner()
    {
        Partner = AllPartners[random.Next(AllPartners.Count)];
    }
    public void AssignChildren()
    {
        Children = random.Next(0, 4);
    }

}
