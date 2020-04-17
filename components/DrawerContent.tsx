import React from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { DrawerHeader, Avatar, DrawerSection } from "material-bread";
import { Image } from "react-native";
import Colors from "../constants/Colors";

export default function DrawerContent(props: any) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerHeader
        style={{backgroundColor: Colors.PrimaryColorLight}}
        title={"Jon Snow"}
        subtitle={"Knows nothing"}
        avatar={
          <Avatar
            type="image"
            image={
              <Image
                source={{
                  uri:
                    "https://www.hbo.com/content/dam/hbodata/series/game-of-thrones/character/s5/john-snow-1920.jpg/_jcr_content/renditions/cq5dam.web.1200.675.jpeg",
                }}
              />
            }
            size={40}
          />
        }
      />
      <DrawerSection bottomDivider>
        <DrawerItemList {...props} />
      </DrawerSection>
    </DrawerContentScrollView>
  );
}
