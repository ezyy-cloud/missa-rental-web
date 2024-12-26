import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { Switch } from '@/components/ui/Switch';
import { useAdminStore } from '@/stores/admin';

interface PlatformSettings {
  commission_rate: number;
  minimum_rental_duration: number;
  maximum_rental_duration: number;
  platform_name: string;
  support_email: string;
  terms_of_service: string;
  privacy_policy: string;
  maintenance_mode: boolean;
  require_id_verification: boolean;
  require_car_insurance: boolean;
  auto_approve_verified_owners: boolean;
}

export function AdminSettings() {
  const [settings, setSettings] = useState<PlatformSettings>({
    commission_rate: 10,
    minimum_rental_duration: 1,
    maximum_rental_duration: 30,
    platform_name: 'Missa Rental',
    support_email: 'support@missarental.com',
    terms_of_service: '',
    privacy_policy: '',
    maintenance_mode: false,
    require_id_verification: true,
    require_car_insurance: true,
    auto_approve_verified_owners: false,
  });

  const handleSave = async () => {
    // TODO: Implement settings update
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Platform Settings</h1>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">General Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Platform Name</label>
              <Input
                type="text"
                value={settings.platform_name}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, platform_name: e.target.value }))
                }
                className="mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Support Email</label>
              <Input
                type="email"
                value={settings.support_email}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, support_email: e.target.value }))
                }
                className="mt-1"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Rental Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Commission Rate (%)</label>
              <Input
                type="number"
                value={settings.commission_rate}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    commission_rate: Number(e.target.value),
                  }))
                }
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Minimum Rental Duration (days)
                </label>
                <Input
                  type="number"
                  value={settings.minimum_rental_duration}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      minimum_rental_duration: Number(e.target.value),
                    }))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Maximum Rental Duration (days)
                </label>
                <Input
                  type="number"
                  value={settings.maximum_rental_duration}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      maximum_rental_duration: Number(e.target.value),
                    }))
                  }
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Verification Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Require ID Verification</label>
                <p className="text-sm text-gray-500">Users must verify their identity before renting</p>
              </div>
              <Switch
                checked={settings.require_id_verification}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, require_id_verification: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Require Car Insurance</label>
                <p className="text-sm text-gray-500">
                  Car owners must provide valid insurance documents
                </p>
              </div>
              <Switch
                checked={settings.require_car_insurance}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, require_car_insurance: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Auto-approve Verified Owners
                </label>
                <p className="text-sm text-gray-500">
                  Automatically approve car listings from verified owners
                </p>
              </div>
              <Switch
                checked={settings.auto_approve_verified_owners}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, auto_approve_verified_owners: checked }))
                }
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Legal Documents</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Terms of Service</label>
              <TextArea
                value={settings.terms_of_service}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, terms_of_service: e.target.value }))
                }
                rows={6}
                className="mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Privacy Policy</label>
              <TextArea
                value={settings.privacy_policy}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, privacy_policy: e.target.value }))
                }
                rows={6}
                className="mt-1"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Maintenance</h2>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Maintenance Mode</label>
              <p className="text-sm text-gray-500">
                Enable maintenance mode to prevent user access to the platform
              </p>
            </div>
            <Switch
              checked={settings.maintenance_mode}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, maintenance_mode: checked }))
              }
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </div>
    </div>
  );
}
