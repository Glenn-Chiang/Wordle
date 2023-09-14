import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh } from '@fortawesome/free-solid-svg-icons/faRefresh';
import { faUnlockAlt } from '@fortawesome/free-solid-svg-icons/faUnlockAlt';

type RestartButtonProps = {
  onClick: () => void;
};

export function RestartButton({ onClick }: RestartButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex gap-2 items-center rounded transition w-full p-2 hover:text-teal-400 hover:border-teal-400 hover:border"
    >
      <FontAwesomeIcon icon={faRefresh} />
      Restart
    </button>
  );
}

type RevealButtonProps = {
  onClick: () => void;
  disabled: boolean;
};

export function RevealButton({ onClick, disabled }: RevealButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`flex gap-2 items-center rounded transition w-full p-2  ${
        disabled
          ? "text-slate-400"
          : "hover:border-teal-400 hover:border hover:text-teal-400"
      }`}
    >
      <FontAwesomeIcon icon={faUnlockAlt} />
      Reveal solution
    </button>
  );
}
