import { useState } from 'react';

// children prop typed using React.ReactNode
interface AlertProps {
    children: React.ReactNode;
}

function Alert({ children }: AlertProps) {
    const [visible, setVisible] = useState(true);

    return (
        <>
            {visible &&
                <div className="alert alert-warning alert-dismissible" role="alert">
                    {children}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setVisible(false)}
                    />
                </div>
            }
        </>
    );
}

export default Alert;