// TypeScript interface - onClick is typed as a function returning void
interface ButtonProps {
    label: string;
    onClick: () => void;
    color?: string; // optional prop with ? 
}

function Button({ label, onClick, color = 'btn-primary' }: ButtonProps) {
    return (
        <button className={'btn ' + color} onClick={onClick}>
            {label}
        </button>
    );
}

export default Button;