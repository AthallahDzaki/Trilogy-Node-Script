import axios from "axios";
import { readFileSync, writeFileSync } from "fs";

(async () => {
    let gift = await axios.get("https://indofinity.com/api/v1/gifts?username=xfrnknstnx");
    /*
    {
        "id": 10874,
        "name": "Community Crown",
        "diamond_count": 99,
        "run_effect": ""
    }
    */
    let ourGift = JSON.parse(readFileSync("./gifts.json", "utf8"));
    let ourGiftImage = JSON.parse(readFileSync("./gift-img.json", "utf8"));
    let giftData = gift.data.data;
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

        /*
        {
            "id": 6064,
            "name": "GG",
            "image": "https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/3f02fa9594bd1495ff4e8aa5ae265eef~tplv-obj.webp"
        },
        */

        if (ourGiftImage.find((x) => x.id == element.id) == undefined) {
            console.log("New Gift Image: " + element.name);
            // giftArr.push({"id" : gift.id, "name" : gift.name, "image" : gift.image.url_list[0]})
            ourGiftImage.push({
                id: element.id,
                name: element.name,
                image: element.image
            });
        }
    })

    ourGift.sort((a, b) => a.diamond_count - b.diamond_count); // Sort by diamond_count

    writeFileSync("./gifts.json", JSON.stringify(ourGift, null, 4), "utf8");
    writeFileSync("./gift-img.json", JSON.stringify(ourGiftImage, null, 4), "utf8");
})();