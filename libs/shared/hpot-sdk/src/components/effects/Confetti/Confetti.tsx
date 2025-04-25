'use client';
import Confetti from 'react-confetti';
import { visualEffects } from '../../../services/visualeffects';
import { observer } from 'mobx-react-lite';
import { linear } from 'tween-functions';

export const ConfettiComponent = observer(() => {
  return (
    visualEffects.confetti_run && (
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        run={visualEffects.confetti_run}
        onConfettiComplete={() => {
          console.log('Confetti Complete');
          visualEffects.onConfettiComplete();
        }}
        numberOfPieces={visualEffects.confetti_numberOfPieces}
        tweenFunction={linear}
      />
    )
  );
});

export default ConfettiComponent;
