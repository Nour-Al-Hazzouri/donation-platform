'use client';

import { ArrowRight, Heart, Shield, Clock } from 'lucide-react';

export function HowDonationHelps() {
  return (
    <div className="bg-card rounded-lg shadow-sm border p-5 md:p-6 overflow-hidden relative">
      {/* Background pattern for visual interest */}
      <div className="absolute -right-16 -top-16 w-32 h-32 bg-primary/5 dark:bg-primary/10 rounded-full blur-2xl" />
      <div className="absolute -left-16 -bottom-16 w-32 h-32 bg-primary/5 dark:bg-primary/10 rounded-full blur-2xl" />
      
      <h3 className="text-lg md:text-xl font-semibold text-foreground mb-4 relative z-10">
        How your donation helps
      </h3>
      
      <div className="grid grid-cols-1 gap-4 md:gap-6 relative z-10">
        {/* Impact Card */}
        <div className="bg-background/50 dark:bg-background/20 backdrop-blur-sm rounded-lg p-4 border border-border/50 transition-all hover:border-primary/30 hover:shadow-md group">
          <div className="flex items-start gap-3">
            <div className="bg-red-100 dark:bg-red-950/50 p-2.5 rounded-full text-red-600 dark:text-red-400">
              <Heart className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-base font-medium text-foreground mb-1">Direct Impact</h4>
              <p className="text-sm text-muted-foreground">
                100% of your donation goes directly to those in need, with no administrative fees or overhead costs.
              </p>
              <div className="mt-2 flex items-center text-xs text-primary group-hover:text-primary/80 transition-colors">
                <span className="font-medium">Learn more</span>
                <ArrowRight className="ml-1 h-3 w-3" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Support Card */}
        <div className="bg-background/50 dark:bg-background/20 backdrop-blur-sm rounded-lg p-4 border border-border/50 transition-all hover:border-primary/30 hover:shadow-md group">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 dark:bg-blue-950/50 p-2.5 rounded-full text-blue-600 dark:text-blue-400">
              <Clock className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-base font-medium text-foreground mb-1">Continuous Support</h4>
              <p className="text-sm text-muted-foreground">
                Our team provides 24/7 assistance and regular updates on how your donation is making a difference.
              </p>
              <div className="mt-2 flex items-center text-xs text-primary group-hover:text-primary/80 transition-colors">
                <span className="font-medium">Learn more</span>
                <ArrowRight className="ml-1 h-3 w-3" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Security Card */}
        <div className="bg-background/50 dark:bg-background/20 backdrop-blur-sm rounded-lg p-4 border border-border/50 transition-all hover:border-primary/30 hover:shadow-md group">
          <div className="flex items-start gap-3">
            <div className="bg-green-100 dark:bg-green-950/50 p-2.5 rounded-full text-green-600 dark:text-green-400">
              <Shield className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-base font-medium text-foreground mb-1">Secure Process</h4>
              <p className="text-sm text-muted-foreground">
                All transactions are encrypted and secure, ensuring your personal information remains protected.
              </p>
              <div className="mt-2 flex items-center text-xs text-primary group-hover:text-primary/80 transition-colors">
                <span className="font-medium">Learn more</span>
                <ArrowRight className="ml-1 h-3 w-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}