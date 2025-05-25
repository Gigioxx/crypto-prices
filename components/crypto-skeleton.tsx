/**
 * CryptoSkeleton Component
 *
 * This skeleton component is designed to match the exact layout of the CryptoTable component
 * to prevent layout shift during loading. It includes:
 *
 * - Data status header with timestamp and cache status indicators
 * - Mobile view with card layout matching the actual component spacing
 * - Desktop view with table layout matching column widths and padding
 * - Last updated footer timestamp
 * - Proper accessibility attributes (aria-label, role attributes)
 * - Responsive design matching the actual component breakpoints
 */

interface CryptoSkeletonProps {
  messages?: {
    crypto?: {
      title?: string;
    };
  };
  showDataStatus?: boolean;
}

export function CryptoSkeleton({ messages, showDataStatus = false }: CryptoSkeletonProps = {}) {
  const ariaLabel = messages?.crypto?.title || 'Cryptocurrency prices loading';

  return (
    <div className='w-full'>
      {/* Data status header skeleton - matches the actual component */}
      {showDataStatus && (
        <div className='mb-4 p-3 bg-muted/30 rounded-lg border border-border/50'>
          <div className='flex items-center justify-between text-sm'>
            <div className='flex items-center space-x-2'>
              <div className='w-4 h-4 bg-muted rounded animate-pulse' />
              <div className='h-4 w-20 bg-muted rounded animate-pulse' />
              <div className='h-4 w-32 bg-muted rounded animate-pulse' />
            </div>
            <div className='flex items-center space-x-2'>
              <div className='h-5 w-12 bg-muted rounded-full animate-pulse' />
            </div>
          </div>
        </div>
      )}

      {/* Mobile skeleton */}
      <div aria-label={ariaLabel} className='block md:hidden space-y-4' role='list'>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className='bg-card border border-border rounded-lg p-4 space-y-3'>
            <div className='flex items-start justify-between'>
              <div className='flex items-center space-x-3'>
                <div className='w-8 h-8 bg-muted rounded-full animate-pulse' />
                <div className='space-y-1'>
                  <div className='h-4 w-20 bg-muted rounded animate-pulse' />
                  <div className='h-3 w-12 bg-muted rounded animate-pulse' />
                  <div className='mt-1 space-y-1'>
                    <div className='h-3 w-8 bg-muted rounded animate-pulse' />
                    <div className='h-3 w-6 bg-muted rounded animate-pulse' />
                  </div>
                </div>
              </div>
              <div className='text-right space-y-1'>
                <div className='h-4 w-16 bg-muted rounded animate-pulse' />
                <div className='h-3 w-12 bg-muted rounded animate-pulse' />
                <div className='mt-1 space-y-1'>
                  <div className='h-3 w-16 bg-muted rounded animate-pulse' />
                  <div className='h-3 w-12 bg-muted rounded animate-pulse' />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop skeleton */}
      <div className='hidden md:block'>
        <div className='overflow-x-auto'>
          <table aria-label={ariaLabel} className='w-full' role='table'>
            <thead role='rowgroup'>
              <tr className='border-b border-border' role='row'>
                <th
                  className='text-left py-3 px-4 font-medium text-muted-foreground'
                  role='columnheader'
                >
                  <div className='h-4 w-12 bg-muted rounded animate-pulse' />
                </th>
                <th
                  className='text-left py-3 px-4 font-medium text-muted-foreground'
                  role='columnheader'
                >
                  <div className='h-4 w-16 bg-muted rounded animate-pulse' />
                </th>
                <th
                  className='text-right py-3 px-4 font-medium text-muted-foreground'
                  role='columnheader'
                >
                  <div className='h-4 w-12 bg-muted rounded animate-pulse ml-auto' />
                </th>
                <th
                  className='text-right py-3 px-4 font-medium text-muted-foreground'
                  role='columnheader'
                >
                  <div className='h-4 w-16 bg-muted rounded animate-pulse ml-auto' />
                </th>
                <th
                  className='text-right py-3 px-4 font-medium text-muted-foreground'
                  role='columnheader'
                >
                  <div className='h-4 w-20 bg-muted rounded animate-pulse ml-auto' />
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 10 }).map((_, i) => (
                <tr key={i} className='border-b border-border'>
                  <td className='py-4 px-4'>
                    <div className='h-4 w-8 bg-muted rounded animate-pulse' />
                  </td>
                  <td className='py-4 px-4'>
                    <div className='flex items-center space-x-3'>
                      <div className='w-8 h-8 bg-muted rounded-full animate-pulse' />
                      <div className='space-y-1'>
                        <div className='h-4 w-24 bg-muted rounded animate-pulse' />
                        <div className='h-3 w-16 bg-muted rounded animate-pulse' />
                      </div>
                    </div>
                  </td>
                  <td className='py-4 px-4 text-right'>
                    <div className='h-4 w-20 bg-muted rounded animate-pulse ml-auto' />
                  </td>
                  <td className='py-4 px-4 text-right'>
                    <div className='h-4 w-16 bg-muted rounded animate-pulse ml-auto' />
                  </td>
                  <td className='py-4 px-4 text-right'>
                    <div className='h-4 w-24 bg-muted rounded animate-pulse ml-auto' />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Last updated timestamp skeleton - matches the actual component footer */}
      {showDataStatus && (
        <div className='flex items-center justify-center py-2 text-xs'>
          <div className='w-3 h-3 bg-muted rounded animate-pulse mr-1' />
          <div className='h-3 w-24 bg-muted rounded animate-pulse' />
        </div>
      )}
    </div>
  );
}
