"use server";

import { requestInfo } from "rwsdk/worker";
import { produceService } from "./produce-service";

export async function togglePickedUpAction({id, pickedUp}: {id: string; pickedUp: boolean}) {

    const user = requestInfo.ctx.user;

    if (!user) {
        return {
            ok: false as const, 
            error: {
                code: 401,
                message: "Du må være logget inn",
            }
        }
        
    }

    return produceService.update(id, {pickedUp}, user.id);

}