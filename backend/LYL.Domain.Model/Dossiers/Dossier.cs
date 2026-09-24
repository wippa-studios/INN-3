using System;

namespace LYL.Domain.Model.Dossiers;

public class Dossier
{
    //Meegeven: livingSituation, Character/Player

    //Insurance etc bijhouden
    
    public DossierData firstWorkphaseDossier = new();
    public DossierData secondWorkphaseDossier;
    public Character Character {get; init;}
    public LivingSituation LivingSituation {get; init;}
    // eventcards
    public SavedEventCards ChoosenEventCards { get; set; }


    public Dossier(Character character, LivingSituation livingSituation)
    {
        Character = character;
        LivingSituation = livingSituation;
    }
}
