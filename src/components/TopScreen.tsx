interface TopScreenProps {
  onStart: () => void;
}

export function TopScreen({ onStart }: TopScreenProps) {
  return (
    <div className="screen screen--top">
      <div className="top-content">
        <h1 className="top-title">駅Guessr</h1>
        <p className="top-tagline">「地図だけで、この駅わかる？」</p>
        <ul className="top-facts">
          <li>1ゲーム5問</li>
          <li>4択クイズ</li>
          <li>全国の駅から出題</li>
        </ul>
      </div>
      <button type="button" className="btn btn--primary btn--large" onClick={onStart}>
        ゲームスタート
      </button>
      <p className="top-footnote">
        地図データ ©Google ／{' '}
        <a href="https://www.google.com/intl/ja/help/terms_maps/" target="_blank" rel="noreferrer">
          Google マップの利用規約
        </a>
      </p>
    </div>
  );
}
