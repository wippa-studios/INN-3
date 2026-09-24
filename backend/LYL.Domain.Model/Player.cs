using LYL.Domain.Model.Interfaces;

namespace LYL.Domain.Model;
using LYL.Domain.Model.Dossiers;
using LYL.Domain.Model.States;

public class Player
{
    public Guid PlayerId { get; set; }
    public string Nickname { get; set; }
    public Table Table { get; set; }
    public string ConnectionId { get; set; }
    public string CurrentPhase { get; set; } = "waiting"; // Standaard beginwaarde
    public Character Character { get; set; }
    public Dossier Dossier {get; set;}
    public DossierState DossierState {get; set;}
    public InvestmentProfile InvestmentProfile { get; set; } = InvestmentProfile.Neutral;

    public void AssignCharacter(Character character, List<Partner> partners)
    {
        Character = character;
        Character.LivingSituation = new LivingSituation(partners);
        Dossier = new(Character, Character.LivingSituation);
    }

    public bool CheckBalanceMonth(DossierData data)
    {
        return DossierState.CheckBalanceMonth(data);
    }

    public void GoToNextPhase()
    {
        //currentPhase => next
        //dossier update if necessary 
        //DossierState.NextPhase
    }

    public bool CheckMontlhy(DossierData data)
    {
        return DossierState.CheckTotalMonthly(data, this);
    }
    
    public bool CheckCalculations(DossierData data,  IInvestmentCalculator calculator)
    {
        return DossierState.CheckCalculationPhase(data, this, calculator );
    }



}