export default function Appleform(){
    return(
        <>
        <h1>Give away apples</h1>
        <p>Amount</p>
        <label>Number of apples
            <input type="number"/>
        </label>
        <label>Total weight
            <input type="number"/>
        </label>
        <select>
            <option></option>
        </select>
        <label>Pick up point
            <input type="number"/>
        </label>
        <p>legg inn bilde</p>
        <label>Delivery deadline
            <input/>
        </label>
        <label>How is the apples packed
            <input type="radio"/>
            <input type="radio"/>
            <input type="radio"/>
        </label>
        </>
    )
}