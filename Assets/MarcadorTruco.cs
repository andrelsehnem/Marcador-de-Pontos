using UnityEngine;
using TMPro;
using UnityEngine.UI;

public class MarcadorTruco : MonoBehaviour
{
    public TextMeshProUGUI pontosTimeA;
    public TextMeshProUGUI pontosTimeB;

    private int scoreA = 0;
    private int scoreB = 0;

    public void SomarA()
    {
        if (scoreA < 12)
            scoreA++;
        AtualizarPlacar();
    }

    public void SubtrairA()
    {
        if (scoreA > 0)
            scoreA--;
        AtualizarPlacar();
    }

    public void SomarB()
    {
        if (scoreB < 12)
            scoreB++;
        AtualizarPlacar();
    }

    public void SubtrairB()
    {
        if (scoreB > 0)
            scoreB--;
        AtualizarPlacar();
    }

    public void Resetar()
    {
        scoreA = 0;
        scoreB = 0;
        AtualizarPlacar();
    }

    void AtualizarPlacar()
    {
        pontosTimeA.text = scoreA.ToString();
        pontosTimeB.text = scoreB.ToString();
    }
}
