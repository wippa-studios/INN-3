using System;
using LYL.Domain.Model.Dossiers;
using LYL.Domain.Model.Interfaces;

namespace LYL.Domain.Model.States;

public abstract class DossierState
{
    protected Dossier Dossier;
    protected bool isChecked = false;
    protected IMemoryAccessService MemoryAccessService;

    protected DossierState(Dossier dossier, IMemoryAccessService memoryAccessService)
    {
        Dossier = dossier;
        MemoryAccessService = memoryAccessService;
    }

    public abstract bool CheckBalanceMonth(DossierData data);
    public abstract bool CheckTotalMonthly(DossierData data, Player player);
    public abstract bool CheckCalculationPhase(DossierData data, Player player,  IInvestmentCalculator calculator);
    public abstract void NextPhase(Player player);
    public abstract bool CheckEventCardsInputAndTotal4(DossierData data, Player player);
    
}
