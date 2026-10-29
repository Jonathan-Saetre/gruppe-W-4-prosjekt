interface Paramsprops{
//enten string eller number basert på etter schema til producelist
    params: {
    id: string;
    }
}
export default function ProduceDetail({params}: Paramsprops){
    const {id} = params
    return(
        <h1>Produce detail</h1>
    )
}