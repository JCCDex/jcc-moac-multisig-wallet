import { mount, createLocalVue } from '@vue/test-utils'
import MainPage from '@/pages'
import VueI18n from "vue-i18n"
const localVue = createLocalVue()
localVue.use(VueI18n);

const i18n = new VueI18n({
  locale: "zh",
  messages: {
    zh: require("@/locales/zh-CN")
  }
});

describe('main page', () => {
  const wrapper = mount(MainPage, {
    i18n,
    localVue,
    sync: true
  })
  const vm = wrapper.vm
  test('is a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  test("default component id is \"Home\"", () => {
    expect(vm.componentId).toBe("Home");
    expect(wrapper.contains({ name: "Home" })).toBe(true)
    expect(wrapper.contains({ name: "Vote" })).toBe(false);
    expect(wrapper.contains({ name: "Mine" })).toBe(false);
  })

  test("has three bottom tabs", () => {
    expect(vm.tabs).toEqual([{
        componentId: "Home",
        tab: "home"
      },
      {
        componentId: "Vote",
        tab: "vote"
      },
      {
        componentId: "Mine",
        tab: "mine"
      }
    ])
  })

  test("tab item event of click", () => {
    const tabs = wrapper.findAll(".mutisig-wallet-tab-bar-item div")
    tabs.at(1).trigger("click")
    expect(vm.componentId).toBe("Vote");
    expect(wrapper.contains({ name: "Home" })).toBe(false)
    expect(wrapper.contains({ name: "Vote" })).toBe(true);
    expect(wrapper.contains({ name: "Mine" })).toBe(false);
    tabs.at(2).trigger("click")
    expect(vm.componentId).toBe("Mine");
    expect(wrapper.contains({ name: "Home" })).toBe(false)
    expect(wrapper.contains({ name: "Vote" })).toBe(false);
    expect(wrapper.contains({ name: "Mine" })).toBe(true);
    tabs.at(0).trigger("click")
    expect(vm.componentId).toBe("Home");
    expect(wrapper.contains({ name: "Home" })).toBe(true)
    expect(wrapper.contains({ name: "Vote" })).toBe(false);
    expect(wrapper.contains({ name: "Mine" })).toBe(false);
    tabs.at(0).trigger("click")
    expect(vm.componentId).toBe("Home");
  })
})