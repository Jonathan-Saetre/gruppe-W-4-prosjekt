import { id } from "zod/v4/locales";

export default function ProduceEdit({onDelete}: {onDelete: (id: string) => void}){
    return(
        <main>
            <button onClick={()=> onDelete(id)}>Delete</button>
        </main>
    )
}