import getMuiTheme from 'material-ui/styles/getMuiTheme'
import transitions from 'material-ui/styles/transitions'
import typography from 'material-ui/styles/typography'
import {fade} from 'material-ui/utils/colorManipulator'

export default function getTheme(theme) {
  return getMuiTheme(theme, {
    fontFamily: [
      'Roboto',
      'Helvetica Neue',
      'Helvetica',
      'Nimbus Sans L',
      'Arial',
      'Liberation Sans',
      'PingFang SC',
      'Hiragino Sans GB',
      'Source Han Sans CN',
      'Source Han Sans SC',
      'Microsoft YaHei',
      // 'Wenquanyi Micro Hei',
      // 'WenQuanYi Zen Hei',
      'ST Heiti',
      'SimHei',
      // 'WenQuanYi Zen Hei Sharp',
      'sans-serif'
    ].join(),
    responsive: {
      tablet: {
        breakpoint: 600,
        mediaQuery: '@media (min-width: 600px)'
      },
      desktop: {
        breakpoint: 960,
        mediaQuery: '@media (min-width: 960px)'
      }
    }
  }, {
    appBar: {
      minHeight: 64,
      maxHeight: 288,
      titleFontSize: 24,
      bodyFontSize: 18,
      titleFontWeight: typography.fontWeightNormal,
      subtitleFontWeight: typography.fontWeightLight,
      bodyFontWeight: typography.fontWeightLight
    },
    footer: {
      backgroundColor: theme.palette.footerColor,
      textColor: theme.palette.alternateTextColor,
      height: 50
    },
    avatar: {
      size: 40,
      borderWidth: 1,
      overlayColor: theme.palette.shadowColor
    },
    gridTile: {
      textColor: theme.palette.alternateTextColor,
      topOverlayBackground: `linear-gradient(to bottom, 
        ${fade(theme.palette.shadowColor, 0.7)} 0%,
        ${fade(theme.palette.shadowColor, 0.3)} 70%,
        ${fade(theme.palette.shadowColor, 0.0)} 100%)`,
      bottomOverlayBackground: 'rgba(0, 0, 0, 0.4)',
      boxHeight: 180,
      overlayHeight: 48,
      textSize: 16,
      overlayTransition: transitions.easeOut(undefined, 'opacity')
    },
    searchField: {
      recommendedWidth: 480
    },
    dialog: {
      recommendedWidth: 480
    },
    slider: {
      recommendedWidth: 120
    }
  })
}
