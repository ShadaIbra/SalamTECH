/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/onboarding/welcome`; params?: Router.UnknownInputParams; } | { pathname: `/paramedic/dashboard`; params?: Router.UnknownInputParams; } | { pathname: `/paramedic/login`; params?: Router.UnknownInputParams; } | { pathname: `/paramedic/route`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `/onboarding/welcome`; params?: Router.UnknownOutputParams; } | { pathname: `/paramedic/dashboard`; params?: Router.UnknownOutputParams; } | { pathname: `/paramedic/login`; params?: Router.UnknownOutputParams; } | { pathname: `/paramedic/route`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | `/onboarding/welcome${`?${string}` | `#${string}` | ''}` | `/paramedic/dashboard${`?${string}` | `#${string}` | ''}` | `/paramedic/login${`?${string}` | `#${string}` | ''}` | `/paramedic/route${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/onboarding/welcome`; params?: Router.UnknownInputParams; } | { pathname: `/paramedic/dashboard`; params?: Router.UnknownInputParams; } | { pathname: `/paramedic/login`; params?: Router.UnknownInputParams; } | { pathname: `/paramedic/route`; params?: Router.UnknownInputParams; };
    }
  }
}
