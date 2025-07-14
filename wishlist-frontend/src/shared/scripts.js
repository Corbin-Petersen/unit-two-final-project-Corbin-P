
export async function openModal(ref) {
    if (ref.current) {
        let thing = await ref;
        thing.current.style.display = "block";
        setTimeout(() => {
            thing.current.style.opacity = "1"
        }, 1);
    }
}
    
export async function closeModal(ref) {
    if (ref.current) {
        let div = await ref;
        div.current.style.opacity = "0";
        setTimeout(() => {
            div.current.style.display = "none"
        }, 250);
    }
}