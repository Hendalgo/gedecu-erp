import { useEffect } from "react";
import DecimalInput from "../components/DecimalInput";

export default function BankAccountForm() {
    // useEffect();

    const handleSubmit = async (ev) => {
        ev.preventDefault()
        const form = new FormData(ev.target);

        try {
            
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            <section>
                {/* Page Info */}
            </section>
            <section className="p-3">
                <form onSubmit={() => null} autoComplete="off" style={{border: "1px solid var()"}}>
                    <div className="row mb-3">
                        <div className="col">
                            <label htmlFor="name" className="form-label">Nombre <span className="Required">*</span></label>
                            <input type="text" name="name" id="name" className="form-control" placeholder="Nombre y apellido" />
                        </div>
                        <div className="col">
                            <label htmlFor="identifier" className="form-label">Identificador <span className="Required">*</span></label>
                            <input type="text" name="identifier" id="identifier" className="form-control" placeholder="00000000; mail@example.com" />
                        </div>
                        <div className="col">
                            <label htmlFor="bank" className="form-label">Banco <span className="Required">*</span></label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <label htmlFor="currency" className="form-label">Moneda <span className="Required">*</span></label>
                        </div>
                        <div className="col">
                            <label htmlFor="balance" className="form-label">Monto inicial <span className="Required">*</span></label>
                            <DecimalInput id="balance" name="balance" />
                        </div>
                    </div>
                </form>
            </section>
        </>
    );
}