import axios from "axios";
import { readFileSync, writeFileSync } from "fs";

(async () => {
    let gift = await axios.get("http://2.node.run.place:7010/");
    /*
    {
        "id": 10874,
        "name": "Community Crown",
        "diamond_count": 99,
        "run_effect": ""
    }
    */
    let ourGift = JSON.parse(readFileSync("./gifts.json", "utf8"));
    let giftData = gift.data;
    giftData.forEach((element) => {
        let contex = {
            id: element.id,
            name: element.name,
            diamond_count: element.diamond_count,
            run_effect: ""
        };

        if (ourGift.find((x) => x.id == element.id) == undefined) {
            console.log("New Gift: " + element.name);
            ourGift.push(contex);
        }

        writeFileSync("./gifts.json", JSON.stringify(ourGift, null, 4), "utf8");
    })
})();