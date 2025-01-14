import DefaultTheme from 'vitepress/theme'
import { onMounted, watch, nextTick } from 'vue';
import { useRoute } from 'vitepress';
import mediumZoom from 'medium-zoom';
// override options: https://github.com/vuejs/vitepress/blob/main/src/client/theme-default/styles/vars.css
import './dashboard.css'
import './overlay.css'
import './widget-card.css'

import PropsTable from '../../components/PropsTable.vue'
import ControlsTable from '../../components/ControlsTable.vue'

export default {
    extends: DefaultTheme,
    setup() {
        const route = useRoute();
        const initZoom = () => {
            mediumZoom('[data-zoomable]', {
                background: 'black',
                margin: 24
            });
        };
        onMounted(() => {
            initZoom();
        });
        // add watcher for route change
        watch(
            () => route.path,
            (to, from) => {
                window.posthog?.capture(
                    '$pageleave',
                    {
                        to: to,
                        $current_url: from
                    }
                )
                window.posthog?.capture(
                    '$pageview',
                    {
                        from: from,
                        $current_url: to
                    }
                )
                nextTick(() => initZoom())
            },
        );
    },
    enhanceApp(ctx) {
        // register your custom global components
        ctx.app.component('PropsTable', PropsTable)
        ctx.app.component('ControlsTable', ControlsTable)
    }
  }