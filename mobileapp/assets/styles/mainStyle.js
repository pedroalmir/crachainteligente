import {
    StyleSheet,
    Dimensions,
    StatusBar
} from 'react-native';

const colors = {
     verdeMusgo : "#135b33",
     verdeFolha : "#218a50",
     branco : '#fdfeff',
     cinza : '#777777',
     cinzaClaro : '#e3e3e3',
     cinzaEscuro: '#232323',
     rubro: "#5b1313",
     main: "232323",
     secondary: "2f2f2f"
}

const Constants = {
    statusbarMargin: StatusBar.currentHeight, 
    baseWidth: 360,
    baseHeight: 616,
    aspX: 1/360 * Dimensions.get("screen").width,
    aspY: 1/616 * Dimensions.get("screen").height,
}

/**
 * Returns the modularized height h 
 */
uHeight = (h) => {
    return h * Constants.aspY;
}

/**
 * Returns the modularized Width h 
 */
uWidth = (w) => {
    return w * Constants.aspX;
}


const styleImages = StyleSheet.create({
    logo:{
      width: 180 * Constants.aspX,
      height: 180 * Constants.aspY,
      resizeMode: 'contain',
      marginTop: 20 * Constants.aspY,
      
    },
    backgroundMain: {
        flex: 1,
        position: "absolute",
        width: '100%',
        height: '100%',
        backgroundColor: colors.verdeMusgo,
        resizeMode: 'stretch'
    },
    background: {
        flex: 1,
        position: "absolute",
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
    },
    iconToolbar: {
        width:28 * Constants.aspX, 
        height:20 * Constants.aspY, 
        resizeMode: "contain"
    },
  });

const styleButtons = StyleSheet.create({
    
    mainButtonLight:{
        width: 180 * Constants.aspX,
        height: 40 * Constants.aspY,
        margin: 15 * Constants.aspY,
        backgroundColor: colors.branco,
        textAlign: 'center',
        fontSize: 16,
        padding: 10 * Constants.aspX,
        color: colors.verdeMusgo
    },
    mainButtonDark:{
        width: 180 * Constants.aspX,
        height: 40 * Constants.aspX,
        backgroundColor: colors.verdeMusgo,
        textAlign: 'center',
        fontSize: 16,
        color: colors.branco,
        padding: 10 * Constants.aspX,
    },
    mainButtonRed:{
        width: 180 * Constants.aspX,
        height: 40 * Constants.aspX,
        backgroundColor: colors.rubro,
        textAlign: 'center',
        fontSize: 16,
        color: colors.branco,
        padding: 10 * Constants.aspX,
    },
    RoundButtonLight:{
        borderRadius: 45 * Constants.aspX,
        width: 40 * Constants.aspX,
        height: 40 * Constants.aspX,
        backgroundColor: colors.branco,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 16,
        margin: 10 * Constants.aspX,
        color: colors.verdeMusgo,
        fontWeight: 'bold',
    },
    RoundButtonDark:{
        borderRadius: 35 * Constants.aspX,
        width: 35 * Constants.aspX,
        height: 35 * Constants.aspY,
        backgroundColor: colors.verdeMusgo,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 20,
        color: colors.branco,
        margin: 10 * Constants.aspX,
        padding: 3 * Constants.aspX,
        fontWeight: 'bold',
    },
    RoundButtonRed:{
        borderRadius: 35 * Constants.aspX,
        width: 35 * Constants.aspX,
        height: 35 * Constants.aspY,
        textAlign: 'center',
        backgroundColor: colors.rubro,
        fontSize: 20,
        color: colors.branco,
        margin: 10 * Constants.aspX,
        padding: 3 * Constants.aspX,
        fontWeight: 'bold',
    },
    touchableText: {
        padding: 10 * Constants.aspX,
        height: 40 * Constants.aspY,
        textAlign: 'center',
        fontSize: 16,
        color: colors.verdeFolha,
    }
  });

const styleText = StyleSheet.create({
    warningDark: {
        fontSize: 17,
        color: colors.cinza,
        textAlign: 'center',
    },
    warningLight: {
        fontSize: 17,
        color: colors.branco,
        textAlign: 'center',
        marginBottom: 10  * Constants.aspY,
    },
    paragraph: {
        justifyContent: 'center',
        fontSize: 17,
        lineHeight: 24 * Constants.aspY,
        textAlign: 'left',
        padding: 10 * Constants.aspX,
        color: colors.cinza,
    },
    title: {
        justifyContent: 'center',
        fontSize: 22,
        lineHeight: 26 * Constants.aspY,
        textAlign: 'left',
        paddingTop: 10 * Constants.aspY,
        paddingLeft: 10 * Constants.aspX,
        paddingBottom: 10 * Constants.aspY,
        color: colors.verdeMusgo,
    },
    titleNoHeader: {
        justifyContent: 'center',
        fontSize: 22,
        lineHeight: 26 * Constants.aspY,
        textAlign: 'left',
        paddingTop: 50 * Constants.aspY,
        paddingLeft: 10 * Constants.aspX,
        paddingBottom: 10 * Constants.aspY,
        color: colors.verdeMusgo,
    },
    subtitle: {
        justifyContent: 'center',
        fontSize: 17,
        lineHeight: 22 * Constants.aspY,
        textAlign: 'left',
        color: colors.verdeFolha,
        paddingLeft: 10 * Constants.aspX,
        paddingBottom: 10 * Constants.aspY,
    },
    input:{
        borderColor: colors.cinzaClaro, 
        borderWidth: 1,
        width: Dimensions.get('screen').width* 0.75, 
        height: 50 * Constants.aspY,
        padding:10 * Constants.aspY, 
        marginLeft: 20 * Constants.aspX,
        marginBottom: 10 * Constants.aspY,
        color: colors.verdeMusgo,
        fontSize: 18,
    },
    destaque: {
        fontSize: 37,
        color: 'black',
        padding: 10 * Constants.aspY,
        marginLeft: 10 * Constants.aspX,
        marginRight: 10 * Constants.aspY,
        textAlign: 'center',
        fontWeight: 'bold',
    }

  });

  const styleContainer = StyleSheet.create({
    container: {
        marginTop: StatusBar.currentHeight, 
        flex: 1,
    }, 
    centerContainer: {
        alignItems: 'center',
        marginTop: 10 * Constants.aspY,
        marginBottom: 20 * Constants.aspY,
        padding: 20 * Constants.aspY,
    },
    leftContainer: {
        alignItems: 'flex-start',
        marginTop: 10 * Constants.aspY,
        marginBottom: 20 * Constants.aspY,
        padding: 30 * Constants.aspY,
    },
    contentContainer: {
        alignItems: 'center',
    },
    contentContainerLeft: {
        alignItems: 'flex-start',
        paddingTop: 10 * Constants.aspY,
    },
    textContainer: {
        alignItems: 'flex-start',
        marginTop: 10 * Constants.aspY,
        marginBottom: 20 * Constants.aspY,
        padding: 30 * Constants.aspY,
    },
    rowContainer: {
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
    },
    toolbar: {
        backgroundColor: colors.verdeMusgo, 
        marginTop: StatusBar.currentHeight, 
        padding: 10, 
        borderBottomColor: colors.cinzaClaro, 
        shadowOffset:{width: 10, height: 10}, 
        shadowColor: colors.cinzaClaro, 
        borderBottomWidth:1,  
        flexDirection: 'row'
    },
    iconContainer:{
        justifyContent:'flex-end', 
        backgroundColor: colors.verdeMusgo, 
        marginTop: 19 * Constants.aspY, 
        padding: 10 * Constants.aspX, 
        paddingTop: 14 * Constants.aspY, 
        marginLeft: 0,
        paddingLeft: 5 * Constants.aspX,
        flexDirection: 'row', 
        alignItems:'baseline',
      },

  });
  

  export default mainStyle = {
      image: styleImages,

      button: styleButtons,

      text: styleText,
      
      container: styleContainer,

      color: colors,

      widthScreen: Dimensions.get('screen').width,
      heightScreen: Dimensions.get('screen').height,
      Constants,
      fHeight: uHeight,
      fWidth: uWidth,
  }