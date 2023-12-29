import { useEffect } from "react";
import PrimaryButton from "./PrimaryButton";
import InputError from "./InputError";
import InputLabel from "./InputLabel";
import Modal from "./Modal";
import SecondaryButton from "./SecondaryButton";
import TextInput from "./TextInput";
import { useForm } from '@inertiajs/react';
import { eventTypes } from "@/utils/eventTypes";
import ActivePill from "./ActivePill";

const WebhookModal = ({ app, currentWebhookId, show, setShow }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        id: null,
        url: '',
        event_types: [], 
    });

    useEffect(() => {
        if (! currentWebhookId || app.webhooks.length === 0) {
            reset();
        }
        console.log("AHHHHH")
        const existingWebhook = app.webhooks.find(({ id }) => id === currentWebhookId) ?? false;

        setData({
            id: existingWebhook.id,
            url: existingWebhook.url ?? '',
            event_types: existingWebhook.event_types ?? [],
        });
    }, [currentWebhookId]);

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.value);
    };

    const handleSubmit = (e) => { 
        post('/apps/' + app.id + '/webhooks/save', {
            // onSuccess: () => setShow(false),
        })
    }

    const toggleEvent = (event_type) => {
        setData((previousData) => {
            const active = !!previousData.event_types.find(type => type === event_type);

            if (active) {
                previousData.event_types = previousData.event_types.filter((item) => item !== event_type) 
            } else {
                previousData.event_types.push(event_type)
            }
            
            return { ...previousData };
        });
    }

    return (
        <Modal show={show} onClose={() => setShow(false)}>
            <form onSubmit={handleSubmit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900">
                    {currentWebhookId ? 'Edit Webhook' : 'Create Webhook'}
                </h2>

                <div className="mt-6 grid grid-cols-1 gap-2">
                    <div>
                        <InputLabel for="url" value="Webhook URL" />

                        <TextInput
                            id="url"
                            name="url"
                            value={data["url"]}
                            className="mt-1 block w-full"
                            handleChange={onHandleChange}
                        />
                    </div>

                    <div>
                        <InputLabel for="events" value="Events" />

                        <div className="grid grid-cols-3 gap-2">
                            {eventTypes.map((eventType) => (
                                <ActivePill
                                    key={eventType.key}
                                    onClick={() => toggleEvent(eventType.key)} 
                                    active={data.event_types.find(type => type === eventType.key)}
                                    label={eventType.label}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={() => setShow(false)}>Cancel</SecondaryButton>

                    <PrimaryButton className="ml-3" processing={processing}>
                        {currentWebhookId ? 'Save' : 'Create'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    )
}

export default WebhookModal;
