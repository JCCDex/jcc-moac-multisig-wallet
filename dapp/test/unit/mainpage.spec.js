import { createLocalVue, shallowMount } from '@vue/test-utils'
import MainPage from '@/pages'
import VueI18n from "vue-i18n"
import VueRouter from 'vue-router'
import Home from "@/pages/index/home";
import Vote from "@/pages/index/Vote";
import Mine from "@/pages/index/Mine";

const router = new VueRouter({
  routes: [
    { path: '/home', name: 'Home', component: Home },
    { path: '/vote', name: 'Vote', component: Vote },
    { path: '/mine', name: 'Mine', component: Mine }
  ]
})
const localVue = createLocalVue()
localVue.use(VueI18n);
localVue.use(VueRouter)

const i18n = new VueI18n({
  locale: "zh",
  messages: {
    zh: require("@/locales/zh-CN")
  }
});

describe('main page', () => {
  const wrapper = shallowMount(MainPage, {
    i18n,
    localVue,
    sync: true,
    router,
    stubs: ['nuxt-child']
  })
  const vm = wrapper.vm
  test('is a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  // test("default component id is \"Home\"", (done) => {
  //   vm.$nextTick(() => {
  //     expect(wrapper.contains({ name: "Home" })).toBe(true)
  //     expect(wrapper.contains({ name: "Vote" })).toBe(false);
  //     expect(wrapper.contains({ name: "Mine" })).toBe(false);
  //     done()
  //   })
  // })

  test("has three bottom tabs", () => {
    expect(vm.tabs).toEqual([{
        componentId: "/home",
        tab: "home"
      },
      {
        componentId: "/vote",
        tab: "vote"
      },
      {
        componentId: "/mine",
        tab: "mine"
      }
    ])
    expect(wrapper.findAll(".mutisig-wallet-tab-bar-item").length).toBe(3);
  })

  // test("tab item event of click", () => {
  //   const tabs = wrapper.findAll(".mutisig-wallet-tab-bar-item")
  //   tabs.at(1).trigger("click")
  //   tabs.at(2).trigger("click")
  //   tabs.at(0).trigger("click")
  // })
})