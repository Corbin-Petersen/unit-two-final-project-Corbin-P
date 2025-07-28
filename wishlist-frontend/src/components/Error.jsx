
export default function Error( props ) {
    const { closeModal } = props;

    return (
        <div id="login-error" className="modal col">
            <button className="close square" onClick={closeModal}><i className="fa-solid fa-xmark"></i></button>
            <p>Oops! Incorrect Username or Password. <br/>
            Please try again.</p>
        </div>
    );
}