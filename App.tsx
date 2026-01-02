
import React, { useState, useEffect, useCallback } from 'react';
import CalculatorButton from './components/CalculatorButton';
import { Operator, CalculatorState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<CalculatorState>({
    display: '0',
    previousValue: null,
    operator: null,
    waitingForNext: false,
  });

  const formatNumber = (num: string) => {
    if (num === 'Error') return 'Error';
    const val = parseFloat(num);
    if (isNaN(val)) return '0';
    
    if (Math.abs(val) > 999999999) {
      return val.toExponential(5);
    }
    
    return val.toLocaleString('en-US', {
      maximumFractionDigits: 8,
    });
  };

  const calculate = (prev: number, current: number, op: Operator): number => {
    switch (op) {
      case '+': return prev + current;
      case '-': return prev - current;
      case '×': return prev * current;
      case '÷': return current !== 0 ? prev / current : NaN;
      default: return current;
    }
  };

  const handleDigit = useCallback((digit: string) => {
    setState(prev => {
      if (prev.waitingForNext) {
        return {
          ...prev,
          display: digit,
          waitingForNext: false
        };
      }
      if (prev.display.length >= 9) return prev;
      return {
        ...prev,
        display: prev.display === '0' ? digit : prev.display + digit
      };
    });
  }, []);

  const handleOperator = useCallback((nextOperator: Operator) => {
    setState(prev => {
      const inputValue = parseFloat(prev.display);

      if (prev.previousValue === null) {
        return {
          ...prev,
          previousValue: inputValue,
          operator: nextOperator,
          waitingForNext: true
        };
      } else if (prev.operator && !prev.waitingForNext) {
        const result = calculate(prev.previousValue, inputValue, prev.operator);
        return {
          ...prev,
          display: isNaN(result) ? 'Error' : String(result),
          previousValue: isNaN(result) ? null : result,
          operator: nextOperator,
          waitingForNext: true
        };
      }

      return {
        ...prev,
        operator: nextOperator,
        waitingForNext: true
      };
    });
  }, []);

  const handleEqual = useCallback(() => {
    setState(prev => {
      if (!prev.operator || prev.previousValue === null) return prev;
      
      const inputValue = parseFloat(prev.display);
      const result = calculate(prev.previousValue, inputValue, prev.operator);
      
      return {
        display: isNaN(result) ? 'Error' : String(result),
        previousValue: null,
        operator: null,
        waitingForNext: true
      };
    });
  }, []);

  const handleClear = useCallback(() => {
    setState({
      display: '0',
      previousValue: null,
      operator: null,
      waitingForNext: false
    });
  }, []);

  const handleToggleSign = useCallback(() => {
    setState(prev => ({
      ...prev,
      display: String(parseFloat(prev.display) * -1)
    }));
  }, []);

  const handlePercent = useCallback(() => {
    setState(prev => ({
      ...prev,
      display: String(parseFloat(prev.display) / 100)
    }));
  }, []);

  const handleDecimal = useCallback(() => {
    setState(prev => {
      if (prev.waitingForNext) {
        return {
          ...prev,
          display: '0.',
          waitingForNext: false
        };
      }
      if (!prev.display.includes('.')) {
        return {
          ...prev,
          display: prev.display + '.'
        };
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/\d/.test(e.key)) handleDigit(e.key);
      if (e.key === '+') handleOperator('+');
      if (e.key === '-') handleOperator('-');
      if (e.key === '*') handleOperator('×');
      if (e.key === '/') handleOperator('÷');
      if (e.key === 'Enter' || e.key === '=') handleEqual();
      if (e.key === 'Escape') handleClear();
      if (e.key === '.') handleDecimal();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleOperator, handleEqual, handleClear, handleDecimal]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#0a0a0a]">
      {/* Outer Case / Shadow for the entire device feel */}
      <div className="w-full max-w-[420px] p-8 rounded-[50px] bg-black shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_2px_10px_rgba(255,255,255,0.05)] flex flex-col gap-4 border border-white/5">
        
        {/* Result Display */}
        <div className="flex flex-col items-end justify-end px-4 mb-6 min-h-[140px]">
          <span 
            className={`text-white font-light tracking-tighter transition-all duration-200 break-all text-right drop-shadow-lg ${
              state.display.length > 7 ? 'text-5xl' : 'text-7xl sm:text-8xl'
            }`}
          >
            {formatNumber(state.display)}
          </span>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-4 sm:gap-5">
          <CalculatorButton 
            label={state.display === '0' && !state.previousValue ? 'AC' : 'C'} 
            onClick={handleClear} 
            variant="utility" 
          />
          <CalculatorButton label="+/-" onClick={handleToggleSign} variant="utility" />
          <CalculatorButton label="%" onClick={handlePercent} variant="utility" />
          <CalculatorButton 
            label="÷" 
            onClick={() => handleOperator('÷')} 
            variant="operator" 
            isActive={state.operator === '÷' && state.waitingForNext}
          />

          <CalculatorButton label="7" onClick={() => handleDigit('7')} />
          <CalculatorButton label="8" onClick={() => handleDigit('8')} />
          <CalculatorButton label="9" onClick={() => handleDigit('9')} />
          <CalculatorButton 
            label="×" 
            onClick={() => handleOperator('×')} 
            variant="operator" 
            isActive={state.operator === '×' && state.waitingForNext}
          />

          <CalculatorButton label="4" onClick={() => handleDigit('4')} />
          <CalculatorButton label="5" onClick={() => handleDigit('5')} />
          <CalculatorButton label="6" onClick={() => handleDigit('6')} />
          <CalculatorButton 
            label="-" 
            onClick={() => handleOperator('-')} 
            variant="operator" 
            isActive={state.operator === '-' && state.waitingForNext}
          />

          <CalculatorButton label="1" onClick={() => handleDigit('1')} />
          <CalculatorButton label="2" onClick={() => handleDigit('2')} />
          <CalculatorButton label="3" onClick={() => handleDigit('3')} />
          <CalculatorButton 
            label="+" 
            onClick={() => handleOperator('+')} 
            variant="operator" 
            isActive={state.operator === '+' && state.waitingForNext}
          />

          <div className="col-span-2">
            <CalculatorButton label="0" onClick={() => handleDigit('0')} isWide />
          </div>
          <CalculatorButton label="." onClick={handleDecimal} />
          <CalculatorButton label="=" onClick={handleEqual} variant="operator" />
        </div>
      </div>
    </div>
  );
};

export default App;
