import React from "react";
import {
  DrawerHeader,
  Avatar,
  DrawerSection,
  DrawerItem,
  Heading,
  Appbar,
  BodyText,
  Drawer,
} from "material-bread";
import { Image, View, StyleSheet } from "react-native";

export default class Root extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      isOpen: true,
    };
  }
  render() {
    const DrawerContent = () => {
      <Root />;
      return (
        <React.Fragment>
          <DrawerHeader
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
            <DrawerItem text={"Inbox"} icon={"mail"} active />
            <DrawerItem text={"Outbox"} icon={"send"} />
            <DrawerItem text={"Favorites"} icon={"favorite"} />
          </DrawerSection>
          {/* <DrawerSection bottomDivider label={"Secondary"}>
            <DrawerItem text={"Important"} icon={"mail"} />
            <DrawerItem text={"Spam"} icon={"send"} />
            <DrawerItem text={"Trash"} icon={"favorite"} />
          </DrawerSection> */}
        </React.Fragment>
      );
    };

    const PageContent = () => {
      return (
        <View style={styles.body}>
          <Heading type={4} style={{ marginBottom: 20 }}>
            This is a page
          </Heading>
          <BodyText text={"Click the menu button to open the drawer"} />
          <BodyText text={"Click outside the drawer to close it"} />
        </View>
      );
    };

    const AppbarContent = () => {
      return (
        <Appbar
          barType={"normal"}
          title={"Page Title"}
          navigation={"menu"}
          onNavigation={() => this.setState({ isOpen: !this.state.isOpen })}
          actionItems={[{ name: "search" }, { name: "more-vert" }]}
        />
      );
    };

    return (
      <View style={styles.container}>
        <Drawer
          open={this.state.isOpen}
          // pageHeight={300}
          scrimStyles={{ position: "absolute" }}
          drawerContent={<DrawerContent />}
          onClose={() => this.setState({ isOpen: false })}
          appbar={<AppbarContent />}
          drawerStyle={{ overflowY: "scroll" }}
        >
          <PageContent />
        </Drawer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
    // border: "1px solid rgba(0,0,0,.12)",
    display: "flex",
    flex: 1,
  },
  body: {
    backgroundColor: "#eee",
    // height: 300,
    width: "100%",
    flex: 1,
    paddingTop: 20,
    alignItems: "center",
    overflow: "scroll",
  },
});
