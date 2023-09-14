import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons/faTrophy";
import { faX } from "@fortawesome/free-solid-svg-icons/faX";
type WinModalProps = {
  answer: string;
  close: () => void;
};

export default function WinModal({ answer, close }: WinModalProps) {
  return (
    <div className="w-screen h-screen fixed z-10 left-0 top-0 bg-teal-500/40 flex justify-center items-center">
      <section className="bg-white rounded-xl p-4 w-1/2 flex flex-col items-center relative">
        <h1 className="text-2xl flex items-center gap-2 text-teal-500">
          <FontAwesomeIcon icon={faTrophy} />
          You Win!
        </h1>
        <FontAwesomeIcon
          onClick={close}
          icon={faX}
          className="absolute right-4"
        />
        <div className="p-2 text-center">
          <p>Answer</p>
          <p className="text-2xl">{answer}</p>
        </div>
      </section>
    </div>
  );
}
