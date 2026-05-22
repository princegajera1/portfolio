declare module "next/dynamic" {
  import { ComponentType, ComponentProps } from "react";
  
  export interface DynamicOptions<P = {}> {
    loader?: () => Promise<ComponentType<P> | { default: ComponentType<P> }>;
    loading?: (loadingProps: { error?: Error | null; isLoading?: boolean; pastDelay?: boolean; retry?: () => void }) => React.ReactNode;
    ssr?: boolean;
    suspense?: boolean;
  }

  export default function dynamic<P = {}>(
    loader: () => Promise<ComponentType<P> | { default: ComponentType<P> }>,
    options?: DynamicOptions<P>
  ): ComponentType<P>;
}
