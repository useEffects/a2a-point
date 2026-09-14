import { OtpInput } from '@syeda_mehwish/react-native-otp-entry';
import { FormInput } from 'app/components/formComponents';
import {
  BackButton,
  Header,
  HeaderTitle,
} from 'app/components/header';
import { SeparatorText } from 'app/components/separator-text';
import { Button } from 'app/components/ui/button';
import { Text } from 'app/components/ui/text';
import { useColorScheme } from 'app/hooks/color-scheme';
import { phoneRegionalCode, portfolioUrl } from 'app/lib/constants';
import userStore from 'app/store/user';
import { parsePhoneNumber } from 'awesome-phonenumber';
import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import Collapsible from 'react-native-collapsible';

export const PhoneVerificationScreen = () => {
  const { user } = userStore();

  const [verified, setVerified] = useState(Boolean(user.phone));
  const [phone, setPhone] = useState<string>(user.phone ?? '');
  const [error, setError] = useState<string | null>(null);
  const [triggered, setTriggered] = useState(false);
  const { colors } = useColorScheme();
  const [otp, setOtp] = useState('');
  const [shouldShowAgain, setShouldShowAgain] = useState(false);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const parsedPhone = useMemo(
    () => parsePhoneNumber(phone, { regionCode: phoneRegionalCode }),
    [phone],
  );

  useEffect(() => {
    if (phone && !parsedPhone.valid) {
      setError('Invalid phone number');
    } else {
      setError(null);
    }
  }, [parsedPhone, phone]);

  const sendVerificationCode = debounce(async () => {
    setLoading(true);
    if (error) return;
    if (!parsedPhone.valid) {
      setError('Invalid phone number');
      setLoading(false);
      return;
    }
    setTriggered(true);
    await fetch(`${portfolioUrl}/api/phone-verify/init`, {
      method: 'POST',
      body: JSON.stringify({
        phone: parsedPhone.number!.e164,
      }),
    });
    setLoading(false);
    setTimeout(() => setShouldShowAgain(true), 30000);
  }, 5000);

  const verifyOtp = async () => {
    console.log('here');
    setLoading(true);
    if (otp.length < 6 || !parsedPhone.valid || !parsedPhone.number) return;
    const res = await fetch(`${portfolioUrl}/api/phone-verify/check`, {
      method: 'POST',
      body: JSON.stringify({
        phone: parsedPhone.number.e164,
        code: otp,
        user: user.id,
      }),
    });
    const { status } = await res.json();
    if (status === 'approved') {
      setVerified(true);
    } else setStatus(status);
    setLoading(false);
  };

  const handleReset = () => {
    setOtp('');
    setPhone('');
    setVerified(false);
    setTriggered(false);
    setShouldShowAgain(false);
  };

  return (
    <View className="gap-12 flex-col flex-1">
      <View className="flex-grow p-4 flex-col gap-12">
        <View className="flex-col gap-8">
          <View className="flex-col gap-2">
            <Text className="text-xl text-primary">
              Verify your phone number
            </Text>
            <Text>
              For integrity purposes, please verify your phone number to ensure
              reliable communication with other agents.
            </Text>
          </View>
          <View className="flex-col gap-2">
            <FormInput
              label="Phone Number"
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              value={
                verified
                  ? parsedPhone.number!.international
                  : phone
                    ? phone.toString()
                    : ''
              }
              onChangeText={(val) => setPhone(val)}
              error={error ?? ''}
              readOnly={verified || triggered}
            />
            {verified ? (
              <Text className="text-success text-sm">
                Phone number verified successfully
              </Text>
            ) : (
              <></>
            )}
          </View>
        </View>
        <Collapsible collapsed={verified || !triggered}>
          <View className="flex-col gap-8">
            <SeparatorText>
              <Text>Enter the OTP</Text>
            </SeparatorText>
            <OtpInput
              focusColor={colors.primary}
              numberOfDigits={6}
              onTextChange={(val) => setOtp(val)}
              theme={{
                pinCodeTextStyle: {
                  color: colors.foreground,
                },
                pinCodeContainerStyle: {
                  borderColor: colors.foreground,
                },
                filledPinCodeContainerStyle: {
                  borderColor: colors.success,
                },
              }}
              autoFocus={false}
            />
            {shouldShowAgain ? (
              <View className="flex-col items-center gap-2">
                <Text className="text-subtext">Didn't receive the otp?</Text>
                <View className="flex-row gap-4">
                  <Button onPress={handleReset} variant={'ghost'} size={'sm'}>
                    <Text>Reset</Text>
                  </Button>
                  <Button
                    onPress={sendVerificationCode}
                    variant={'ghost'}
                    size={'sm'}
                  >
                    <Text>Send again</Text>
                  </Button>
                </View>
              </View>
            ) : (
              <></>
            )}
          </View>
        </Collapsible>
        {
          <View className="flex-col gap-2 mt-auto mb-0">
            {verified ? (
              <>
                <Button onPress={handleReset} variant={'destructive'}>
                  <Text>Change phone number</Text>
                </Button>
              </>
            ) : (
              <>
                {triggered ? (
                  loading ? (
                    <></>
                  ) : (
                    <Button onPress={verifyOtp}>
                      <Text>Verify</Text>
                    </Button>
                  )
                ) : loading ? (
                  <></>
                ) : (
                  <Button onPress={sendVerificationCode}>
                    <Text>Send verification code (SMS)</Text>
                  </Button>
                )}
                {status ? (
                  <Text className="text-destructive text-sm text-center">
                    {status}
                  </Text>
                ) : (
                  <></>
                )}
              </>
            )}
          </View>
        }
      </View>
    </View>
  );
};

export function PhoneVerificationScreenHeader() {
  return (
    <Header>
      <View className="flex-row items-center gap-4">
        <BackButton />
        <HeaderTitle>Phone</HeaderTitle>
      </View>
    </Header>
  );
}
