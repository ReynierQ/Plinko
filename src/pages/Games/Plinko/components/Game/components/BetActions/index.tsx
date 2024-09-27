import { Coin, CurrencyDollarSimple } from 'phosphor-react'
import { ChangeEvent, useState } from 'react'
import { useAuthStore } from 'store/auth'

import { LinesType } from '../../@types'

interface PlinkoBetActions {
  onRunBet: (betValue: number) => void
  onChangeLines: (lines: LinesType) => void
  inGameBallsCount: number
}

export function BetActions({
  onRunBet,
  onChangeLines,
  inGameBallsCount
}: PlinkoBetActions) {
  const isLoading = useAuthStore(state => state.isWalletLoading)
  const [balance, setBalance] = useState(500.00)  // Initial balance
  const isAuth = useAuthStore(state => state.isAuth)
  const [betValue, setBetValue] = useState(100.00)  // Initial bet value
  const maxLinesQnt = 16
  const linesOptions: number[] = []
  for (let i = 8; i <= maxLinesQnt; i++) {
    linesOptions.push(i)
  }

  function handleChangeBetValue(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    const value = +e.target.value
    const newBetValue = value >= balance ? balance : value
    setBetValue(newBetValue)
  }

  function handleChangeLines(e: ChangeEvent<HTMLSelectElement>) {
    onChangeLines(Number(e.target.value) as LinesType)
  }

  function handleHalfBet() {
    const value = betValue / 2
    const newBetValue = value <= 0 ? 0 : Math.floor(value)
    setBetValue(newBetValue)
  }

  function handleDoubleBet() {
    const value = betValue * 2
    if (value >= balance) {
      setBetValue(balance)
      return
    }
    const newBetValue = value <= 0 ? 0 : Math.floor(value)
    setBetValue(newBetValue)
  }

  function handleMaxBet() {
    setBetValue(balance)
  }

  async function handleRunBet() {
    if (inGameBallsCount >= 15) return
    if (betValue > balance) {
      setBetValue(balance)
      return
    }
    
    // Deduct the bet amount from the balance
    setBalance(prevBalance => prevBalance - betValue)
    onRunBet(betValue)

    // Simulate winnings (e.g., 2x the bet amount for simplicity)
    const winnings = betValue * 2  // Example logic for winnings
    setTimeout(() => {
      setBalance(prevBalance => prevBalance + winnings)  // Add winnings to the balance
    }, 1000)  // Simulate a delay for the win
  }

  return (
    <div className="relative h-1/2 w-full flex-1 py-8 px-4">
      <span className="absolute left-4 top-0 mx-auto text-xs font-bold text-text md:text-base">
        balls in play &nbsp;
        {inGameBallsCount}/15
      </span>

      <div className="flex h-full flex-col gap-4 rounded-md bg-primary p-4 text-text md:justify-between">
        
        {/* Display Bet Amount */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-stretch gap-1 md:flex-col">
            <div className="w-full text-sm font-bold md:text-base">
              <div className="flex flex-1 items-stretch justify-between">
                <span>Bet Amount</span>
                <div className="flex items-center gap-1">
                  <div className="rounded-full bg-purpleDark p-0.5">
                    <CurrencyDollarSimple weight="bold" />
                  </div>
                  <span>{betValue.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex items-stretch justify-center shadow-md">
                <input
                  type="number"
                  min={0}
                  max={balance}
                  onChange={handleChangeBetValue}
                  value={betValue}
                  className="w-full rounded-bl-md rounded-tl-md border-2 border-secondary bg-background p-2.5 px-4 font-bold transition-colors placeholder:font-bold placeholder:text-text focus:border-purple focus:outline-none md:p-2"
                />
                <button
                  onClick={handleHalfBet}
                  className="relative border-2 border-transparent bg-secondary p-2.5 px-3 transition-colors after:absolute after:top-[calc(50%_-_8px)] after:right-0 after:h-4 after:w-0.5 after:rounded-lg after:bg-background after:content-[''] hover:bg-secondary/80 focus:border-purple focus:outline-none md:p-2"
                >
                  ½
                </button>
                <button
                  onClick={handleDoubleBet}
                  className="relative border-2 border-transparent bg-secondary p-2.5 px-3 transition-colors after:absolute after:top-[calc(50%_-_8px)] after:right-0 after:h-4 after:w-0.5 after:rounded-lg after:bg-background after:content-[''] hover:bg-secondary/80 focus:border-purple focus:outline-none md:p-2"
                >
                  2x
                </button>
                <button
                  onClick={handleMaxBet}
                  className="rounded-br-md rounded-tr-md border-2 border-transparent bg-secondary p-2 px-3 text-xs transition-colors hover:bg-secondary/80 focus:border-purple focus:outline-none"
                >
                  max
                </button>
              </div>
            </div>

            <button
              onClick={handleRunBet}
              disabled={isLoading}
              className="block rounded-md bg-purple px-2 py-4 text-sm font-bold leading-none text-background transition-colors hover:bg-purpleDark focus:outline-none focus:ring-1 focus:ring-purple focus:ring-offset-1 focus:ring-offset-primary disabled:bg-gray-500 md:hidden"
            >
              Bet
            </button>
          </div>

          {/* Display Balance */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold">Balance</span>
            <div className="flex items-center gap-1">
              <div className="rounded-full bg-green-500 p-0.5">
                <Coin weight="bold" />
              </div>
              <span>{balance.toFixed(2)}</span>
            </div>
          </div>

          <select
            disabled={inGameBallsCount > 0}
            onChange={handleChangeLines}
            defaultValue={16}
            className="w-full rounded-md border-2 border-secondary bg-background py-2 px-4 font-bold transition-all placeholder:font-bold placeholder:text-text focus:border-purple focus:outline-none disabled:line-through disabled:opacity-80"
            id="lines"
          >
            {linesOptions.map(line => (
              <option key={line} value={line}>
                {line} Lines
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleRunBet}
          disabled={isLoading}
          className="hidden rounded-md bg-purple px-6 py-5 font-bold leading-none text-background transition-colors hover:bg-purpleDark focus:outline-none focus:ring-1 focus:ring-purple focus:ring-offset-1 focus:ring-offset-primary disabled:bg-gray-500 md:visible md:block"
        >
          Bet
        </button>
      </div>
    </div>
  )
}
